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
  // CRUD Cycle
  createCycle(dto: CreateCycleDTO): Promise<CycleModel>
  getAllCycles(): Promise<CycleModel[]>
  getCyclesByFund(fundId: string): Promise<CycleModel[]>
  getCycleDetail(cycleId: string): Promise<CycleModel>
  updateCycle(dto: UpdateCycleDTO): Promise<CycleModel>
  closeCycle(cycleId: string): Promise<{ message: string }>

  // Business: Claim / Hốt
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

      // --- [SỬA ĐỔI]: Cho phép nhiều người hốt, không throw lỗi nếu đã có người hốt ---

      // Kiểm tra xem người này đã hốt trong kỳ này chưa (tránh hốt 2 lần trong 1 kỳ)
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

      // Map: PlayerId -> Số chân đã hốt (Dead legs) từ các kỳ trước
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
      const fundAmount = fund.amount // A (Tiền hụi gốc)
      const fee = fund.fee // E (Tiền thảo chủ hụi lấy)

      // Tính tiền thực nhận cho người hốt này (tạm tính dựa trên giả định chỉ có 1 người hốt để lấy số liệu cơ sở)
      // Thực tế: Received = (Tổng thu từ mọi người) - Fee
      // Tuy nhiên ta cần cập nhật danh sách claimers trước để biết có bao nhiêu người hốt

      // --- Thêm người hốt mới vào danh sách tạm thời ---
      const newClaimer = {
        player: playerId as any,
        legsClaimed: 1,
        paidAmount: bidAmount, // Tiền kêu của người này
        amountReceived: 0, // Sẽ tính sau
        claimedAt: new Date()
      }
      const currentClaimers = [...cycle.claimers, newClaimer]
      const currentClaimerIds = currentClaimers.map((c) => c.player.toString())

      // --- [QUAN TRỌNG]: Xác định tiền kêu (B) dùng để tính toán ---
      // Yêu cầu: "chỉ lấy số tiền hốt của người đầu tiên để tính cho các người khác"
      const firstClaimer = currentClaimers[0]
      const baseBidAmount = firstClaimer.paidAmount // Đây là B dùng để trừ cho chân sống
      const numberOfWinners = currentClaimers.length // Hệ số nhân tiền đóng

      // 3. Tính toán tiền đóng (Payments) cho toàn bộ thành viên
      const payments: PaymentDetail[] = []
      const newTransactions = []

      // Biến tính tổng thu của 1 suất hốt (để tính amountReceived)
      let unitTotalCollected = 0

      for (const member of fund.members) {
        const mPlayerId = member.player.toString()

        // Những người đang hốt trong kỳ này KHÔNG đóng tiền cho chính mình và những người cùng hốt
        if (currentClaimerIds.includes(mPlayerId)) continue

        const totalLegs = member.initialLegs
        const deadLegs = deadLegsMap.get(mPlayerId) || 0
        const livingLegs = totalLegs - deadLegs

        if (livingLegs < 0) continue

        // Logic tính tiền CƠ SỞ (cho 1 suất hốt):
        // Chân chết: Đóng đủ A
        // Chân sống: Đóng A - B_first (Theo yêu cầu)
        const unitAmountFromDead = deadLegs * fundAmount
        const unitAmountFromLiving = livingLegs * (fundAmount - baseBidAmount)
        const unitTotalPay = unitAmountFromDead + unitAmountFromLiving

        // Tổng tiền người này phải đóng = Tiền cơ sở * Số lượng người hốt
        const finalTotalPay = unitTotalPay * numberOfWinners

        if (finalTotalPay > 0) {
          // a. Lưu vào payment để hiển thị
          payments.push({
            player: mPlayerId as any,
            amountDue: finalTotalPay,
            isPaid: false // Reset trạng thái đóng tiền khi có người hốt mới (hoặc logic phức tạp hơn là giữ nguyên nếu đã đóng phần cũ)
          })

          // b. Tạo Transaction (Ghi đè lại toàn bộ transaction của kỳ này)
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

      // 4. Cập nhật lại amountReceived cho TẤT CẢ người hốt trong kỳ này
      // Giả sử tổng thu được chia đều hoặc mỗi người nhận đúng phần của mình (Unit Total - Fee)
      const unitReceivedAmount = unitTotalCollected - fee

      const updatedClaimers = currentClaimers.map((c) => ({
        ...c,
        amountReceived: unitReceivedAmount // Mỗi người hốt nhận được phần tiền thu được từ 1 suất đóng
      }))

      // 5. Cập nhật Cycle
      cycle.claimers = updatedClaimers
      cycle.payments = payments // Lưu danh sách người đóng mới

      await cycle.save({ session })

      // 6. Cập nhật Transactions: Xóa cũ, Thêm mới
      // Xóa các transaction cũ của kỳ này (để tránh duplicate hoặc sai số liệu khi số người hốt thay đổi)
      await this.transactionModel.deleteMany({ cycle: cycleId }).session(session)

      if (newTransactions.length > 0) {
        // Dùng insertMany thay vì create cho mảng
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

      // 1. Reset Cycle
      cycle.claimers = []
      cycle.payments = []
      cycle.closed = false
      await cycle.save({ session })

      // 2. Xóa sạch Transaction
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
