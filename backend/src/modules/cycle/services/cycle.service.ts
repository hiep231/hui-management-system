import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import mongoose, { ClientSession } from 'mongoose'
import { PlayerModel } from 'src/modules/player/models/player.model'
import { BaseService } from 'src/shares/services/mongo/base.service'
import { ClaimCycleDTO, CreateCycleDTO, UpdateCycleDTO } from '../dto/cycle.dto'
import { CycleModel, PaymentDetail } from '../models/cycle.model'
import { FundMember, FundModel } from 'src/modules/fund/models/fund.model'
import { IJsonResponse, JsonResponse } from 'src/shares/controllers/json.response'
import { FundService } from 'src/modules/fund/services/fund.service'
import { MESSAGES_CODE } from 'src/shares/constants/status.constants'
import { TransactionModel } from '../models/transaction.model'

interface ICycleService {
  createCycle(dto: CreateCycleDTO): Promise<CycleModel>
  getAllCycles(): Promise<CycleModel[]>
  getCyclesByFund(fundId: string): Promise<CycleModel[]>
  getCycleDetail(cycleId: string): Promise<CycleModel>
  updateCycle(dto: UpdateCycleDTO): Promise<CycleModel>
  closeCycle(cycleId: string): Promise<{ message: string }>

  claim(dto: ClaimCycleDTO): Promise<IJsonResponse<any>>
  unclaim(dto: { cycleId: string; fundId: string }): Promise<IJsonResponse<any>>
  getStats(dateString: string, type: 'day' | 'month' | 'year')
  updatePaymentStatus(cycleId: string, playerId: string, isPaid: boolean): Promise<IJsonResponse<any>>
}

@Injectable()
export class CycleService extends BaseService<CycleModel> implements ICycleService {
  constructor(
    @InjectModel(CycleModel.name) private readonly cycleModel: ModelType<CycleModel>,
    @InjectModel(TransactionModel.name) private readonly transactionModel: ModelType<TransactionModel>,
    @InjectModel(FundModel.name) private readonly fundModel: ModelType<FundModel>,
    @InjectModel(PlayerModel.name) private readonly playerModel: ModelType<PlayerModel>,

    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly fundService: FundService
  ) {
    super(cycleModel)
  }

  /** ===============================
   * CRUD CYCLE
   * =============================== */

  async createCycle(dto: CreateCycleDTO): Promise<CycleModel> {
    const fund = await this.fundModel.findById(dto.fundId)
    if (!fund) throw new NotFoundException('Fund not found')

    const exist = await this.cycleModel.findOne({
      fund: dto.fundId,
      cycleNumber: dto.cycleNumber
    })
    if (exist) throw new BadRequestException('Cycle đã tồn tại trong fund này')

    const cycle = await this.cycleModel.create({
      fund: dto.fundId,
      cycleNumber: dto.cycleNumber,
      payoutDate: new Date(dto.payoutDate)
    })
    return cycle
  }

  async getAllCycles(): Promise<CycleModel[]> {
    return this.cycleModel.find().populate('fund').sort({ payoutDate: 1 }).lean()
  }

  async getCyclesByFund(fundId: string) {
    const fund = await this.fundModel.findById(fundId).lean()
    if (!fund) throw new NotFoundException('Fund not found')
    return this.cycleModel.find({ fund: fundId }).sort({ cycleNumber: 1 }).lean()
  }

  async getCycleDetail(id: string) {
    const cycle = await this.cycleModel.findById(id).populate('fund').lean()
    if (!cycle) throw new NotFoundException('Cycle not found')
    return cycle
  }

  async updateCycle(dto: UpdateCycleDTO) {
    const cycle = await this.cycleModel.findById(dto.cycleId)
    if (!cycle) throw new NotFoundException('Cycle not found')

    if (dto.payoutDate) cycle.payoutDate = new Date(dto.payoutDate)
    if (dto.closed !== undefined) cycle.closed = dto.closed
    await cycle.save()

    return cycle
  }

  async closeCycle(cycleId: string) {
    const cycle = await this.cycleModel.findById(cycleId)
    if (!cycle) throw new NotFoundException('Cycle not found')
    cycle.closed = true
    await cycle.save()
    return { message: 'Đã đóng kỳ thành công' }
  }

  /** ===============================
   * BUSINESS LOGIC: CLAIM / HỐT HỤI
   * =============================== */

  async claim(dto: ClaimCycleDTO) {
    const session = await this.connection.startSession()
    session.startTransaction()

    try {
      const { fundId, cycleId, playerId, paidAmount: bidAmount } = dto

      const fund = await this.fundModel.findById(fundId).lean()
      if (!fund) throw new NotFoundException('Không tìm thấy dây hụi')

      const cycle = await this.cycleModel.findById(cycleId)
      if (!cycle) throw new NotFoundException('Không tìm thấy kỳ hụi')

      const alreadyClaimed = cycle.claimers.some((c) => c.player.toString() === playerId)
      if (alreadyClaimed) {
        throw new BadRequestException('Người chơi này đã hốt trong kỳ này rồi!')
      }

      // 1. Lấy lịch sử các kỳ TRƯỚC (không tính kỳ này) để tính chân chết
      const previousCycles = await this.cycleModel
        .find({
          fund: fundId,
          'claimers.0': { $exists: true },
          cycleNumber: { $lt: cycle.cycleNumber } // Chỉ lấy các kỳ trước đó
        })
        .lean()

      const deadLegsMap = new Map<string, number>()
      previousCycles.forEach((c) => {
        if (c.claimers && c.claimers.length > 0) {
          c.claimers.forEach((claimer) => {
            const pId = claimer.player.toString()
            const count = deadLegsMap.get(pId) || 0
            deadLegsMap.set(pId, count + (claimer.legsClaimed || 1))
          })
        }
      })

      // 2. Tính toán thông tin người hốt mới
      const fundAmount = fund.amount
      const fee = fund.fee

      const newClaimer = {
        player: playerId as any,
        legsClaimed: 1,
        paidAmount: bidAmount,
        amountReceived: 0,
        claimedAt: new Date()
      }
      const currentClaimers = [...cycle.claimers, newClaimer]
      const currentClaimerIds = currentClaimers.map((c) => c.player.toString())

      const firstClaimer = currentClaimers[0]
      const baseBidAmount = firstClaimer.paidAmount
      const numberOfWinners = currentClaimers.length

      const payments: PaymentDetail[] = []
      const newTransactions = []

      let unitTotalCollected = 0

      for (const member of fund.members) {
        const mPlayerId = member.player.toString()

        if (currentClaimerIds.includes(mPlayerId)) continue

        const totalLegs = member.initialLegs
        const deadLegs = deadLegsMap.get(mPlayerId) || 0
        const livingLegs = totalLegs - deadLegs

        if (livingLegs < 0) continue

        const unitAmountFromDead = deadLegs * fundAmount
        const unitAmountFromLiving = livingLegs * (fundAmount - baseBidAmount)
        const unitTotalPay = unitAmountFromDead + unitAmountFromLiving

        const finalTotalPay = unitTotalPay * numberOfWinners

        if (finalTotalPay > 0) {
          payments.push({
            player: mPlayerId as any,
            amountDue: finalTotalPay,
            isPaid: false
          })

          newTransactions.push({
            fund: fundId,
            cycle: cycleId,
            cycleNumber: cycle.cycleNumber,
            player: mPlayerId,
            amountDue: finalTotalPay,
            amountPaid: 0,
            status: 'PENDING',
            type: 'COLLECTION',
            isDelete: false
          })

          unitTotalCollected += unitTotalPay
        }
      }

      const unitReceivedAmount = unitTotalCollected - fee

      const updatedClaimers = currentClaimers.map((c) => ({
        ...c,
        amountReceived: unitReceivedAmount
      }))

      cycle.claimers = updatedClaimers
      cycle.payments = payments

      await cycle.save({ session })

      await this.transactionModel.deleteMany({ cycle: cycleId }).session(session)

      if (newTransactions.length > 0) {
        await this.transactionModel.insertMany(newTransactions, { session })
      }

      await session.commitTransaction()

      const populatedCycle = await this.cycleModel
        .findById(cycleId)
        .populate('claimers.player')
        .populate('payments.player')

      return JsonResponse.success(populatedCycle, 'Hốt hụi thành công')
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  /** ===============================
   * BUSINESS LOGIC: UNCLAIM / HỦY HỐT
   * =============================== */

  async unclaim(dto: { cycleId: string; fundId: string }) {
    const session = await this.connection.startSession()
    session.startTransaction()

    try {
      const cycle = await this.cycleModel.findById(dto.cycleId)
      if (!cycle) throw new NotFoundException('Cycle not found')

      // Reset Cycle
      cycle.claimers = []
      cycle.payments = []
      cycle.closed = false
      await cycle.save({ session })

      // Xóa sạch Transaction
      await this.transactionModel.deleteMany({ cycle: dto.cycleId }).session(session)

      await session.commitTransaction()
      return JsonResponse.success(null, 'Đã hủy hốt hụi')
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  /** ===============================
   * BUSINESS LOGIC: CẬP NHẬT ĐÓNG TIỀN
   * =============================== */

  async updatePaymentStatus(cycleId: string, playerId: string, isPaid: boolean) {
    const session = await this.connection.startSession()
    session.startTransaction()

    try {
      const cycle = await this.cycleModel.findById(cycleId)
      if (!cycle) throw new NotFoundException('Cycle not found')

      const paymentIndex = cycle.payments.findIndex((p) => p.player.toString() === playerId)
      if (paymentIndex > -1) {
        cycle.payments[paymentIndex].isPaid = isPaid
        cycle.markModified('payments')
        await cycle.save({ session })
      }

      const transaction = await this.transactionModel.findOne({
        cycle: cycleId,
        player: playerId
      })

      if (transaction) {
        transaction.status = isPaid ? 'PAID' : 'PENDING'
        if (isPaid) {
          transaction.paidAt = new Date()
          transaction.amountPaid = transaction.amountDue
        } else {
          transaction.paidAt = null
          transaction.amountPaid = 0
        }
        await transaction.save({ session })
      }

      await session.commitTransaction()
      return JsonResponse.success(null, 'Cập nhật trạng thái thành công')
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  /** ===============================
   * STATS
   * =============================== */
  async getStats(dateString: string, type: 'day' | 'month' | 'year' = 'day') {
    const date = new Date(dateString)
    const start = new Date(date)
    const end = new Date(date)

    if (type === 'day') {
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
    } else if (type === 'month') {
      start.setDate(1)
      start.setHours(0, 0, 0, 0)
      end.setMonth(end.getMonth() + 1)
      end.setDate(0)
      end.setHours(23, 59, 59, 999)
    } else if (type === 'year') {
      start.setMonth(0, 1)
      start.setHours(0, 0, 0, 0)
      end.setMonth(11, 31)
      end.setHours(23, 59, 59, 999)
    }

    const incomeStats = await this.transactionModel.aggregate([
      {
        $match: {
          paidAt: { $gte: start, $lte: end },
          status: 'PAID',
          type: 'COLLECTION'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amountPaid' }
        }
      }
    ])

    const expenseStats = await this.cycleModel.aggregate([
      { $unwind: '$claimers' },
      {
        $match: {
          'claimers.claimedAt': { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$claimers.amountReceived' }
        }
      }
    ])

    const transactions = await this.transactionModel
      .find({
        paidAt: { $gte: start, $lte: end },
        status: 'PAID'
      })
      .populate('player', 'userName')
      .populate('fund', 'name')
      .sort({ paidAt: -1 })
      .lean()

    const formattedTransactions = transactions.map((tx) => ({
      type: tx.type === 'COLLECTION' ? 'INCOME' : 'EXPENSE',
      amount: tx.amountPaid,
      time: tx.paidAt,
      player: tx.player,
      fundName: (tx.fund as any)?.name,
      cycleNumber: tx.cycleNumber
    }))

    const totalRevenue = incomeStats[0]?.total || 0
    const totalExpenditure = expenseStats[0]?.total || 0

    return {
      totalRevenue,
      totalExpenditure,
      transactions: formattedTransactions
    }
  }
}
