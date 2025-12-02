import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreatePlayerDTO, JoinFundDTO, UpdatePlayerDTO } from '../dto/player.dto'
import { BaseService } from 'src/shares/services/mongo/base.service'
import { PlayerModel } from '../models/player.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { FundModel, FundMember } from 'src/modules/fund/models/fund.model'
import { FundService } from 'src/modules/fund/services/fund.service'
import { CycleModel } from 'src/modules/cycle/models/cycle.model'
import { CycleService } from 'src/modules/cycle/services/cycle.service'
import { ClaimCycleDTO } from '../dto/cycle.dto'
import { JsonResponse, IJsonResponse } from 'src/shares/controllers/json.response'
import { MESSAGES_CODE } from 'src/shares/constants/status.constants'
import { CreateFundDTO } from 'src/modules/fund/dto/fund.dto'
import { TransactionModel } from 'src/modules/cycle/models/transaction.model'

interface IPlayerService {
  createPlayer(dto: CreatePlayerDTO): Promise<PlayerModel>
  getAllPlayers(): Promise<PlayerModel[]>
  getPlayerById(id: string): Promise<any>
  getFundsByPlayer(playerId: string): Promise<any[]>
  getFundDetail(playerId: string, fundId: string): Promise<IJsonResponse<any>> // Đã sửa
}

@Injectable()
export class PlayerService extends BaseService<PlayerModel> implements IPlayerService {
  constructor(
    @InjectModel(PlayerModel.name) private readonly playerModel: ModelType<PlayerModel>,
    @InjectModel(TransactionModel.name) private readonly transactionModel: ModelType<TransactionModel>,
    @InjectModel(FundModel.name) private readonly fundModel: ModelType<FundModel>,
    @InjectModel(CycleModel.name) private readonly cycleModel: ModelType<CycleModel>,
    private readonly fundService: FundService,
    private readonly cycleService: CycleService
  ) {
    super(playerModel)
  }

  async createPlayer(dto: CreatePlayerDTO) {
    return await this.playerModel.create({ ...dto })
  }

  async getAllPlayers() {
    return this.playerModel.find().lean()
  }

  async getPlayerById(id: string) {
    const player = await this.playerModel.findById(id).lean()
    if (!player) throw new NotFoundException('Player not found')

    const funds = await this.fundModel.find({ 'members.player': id }).lean()
    return { ...player, funds }
  }

  async updatePlayer(id: string, dto: UpdatePlayerDTO) {
    const player = await this.playerModel.findById(id)
    if (!player) throw new NotFoundException('Player not found')

    const updated = await this.updateOne({ _id: id }, dto)
    return updated
  }

  async deletePlayer(id: string) {
    const player = await this.playerModel.findById(id)
    if (!player) throw new NotFoundException('Player not found')

    // Soft delete
    player.isDelete = true
    await player.save()

    return { message: 'Đã xóa người chơi thành công' }
  }

  /** ===============================
   * FUND OPERATIONS
   * =============================== */

  async createFund(dto: CreateFundDTO): Promise<FundModel> {
    throw new BadRequestException('Sử dụng API /funds/with-members để tạo Fund kèm danh sách thành viên.')
  }

  async getFundsGrouped() {
    // Sẽ trả về JsonResponse trong Controller
    return this.fundModel.aggregate([
      {
        $group: {
          _id: '$name',
          funds: { $push: '$$ROOT' },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ])
  }

  // Cập nhật logic joinFund (Yêu cầu 3.1)
  async joinFund(dto: JoinFundDTO) {
    const { playerId, fundId, legs } = dto
    const fund = await this.fundModel.findById(fundId)
    const player = await this.playerModel.findById(playerId)

    if (!fund) throw new NotFoundException('Fund not found')
    if (!player) throw new NotFoundException('Player not found')

    // Check if player already a member
    const existingMember = fund.members.find((m) => m.player.toString() === playerId)
    if (existingMember) {
      throw new BadRequestException('Người chơi đã tham gia dây hụi này')
    }

    // Kiểm tra tổng chân hiện tại
    const currentTotalLegs = fund.totalLegsRegistered
    if (currentTotalLegs + Number(legs) > fund.totalCycles) {
      throw new BadRequestException(`Không đủ chỗ. Tổng chân tối đa là ${fund.totalCycles}.`)
    }

    // Thêm vào fund.members
    const newMember: FundMember = {
      player: playerId,
      initialLegs: Number(legs),
      legsClaimed: 0,
      claimedCycleNumbers: []
    } as FundMember
    fund.members.push(newMember)
    fund.totalLegsRegistered += Number(legs)

    await fund.save()

    return { fund, player }
  }

  async getFundsByPlayer(playerId: string) {
    const player = await this.playerModel.findById(playerId).lean()
    if (!player) throw new NotFoundException('Player not found')

    const funds = await this.fundModel.find({ 'members.player': playerId }).lean()
    return funds
  }

  /** ===============================
   * FUND DETAIL / CYCLES (TRIỂN KHAI LOGIC YÊU CẦU 2 & 3.2)
   * =============================== */

  async getFundDetail(playerId: string, fundId: string): Promise<IJsonResponse<any>> {
    // 1. Lấy thông tin Fund
    const fund = await this.fundModel.findById(fundId).populate('members.player').lean()
    if (!fund) return JsonResponse.error('Fund not found')

    const cycles = await this.cycleModel.find({ fund: fundId }).populate('claimers.player').lean()

    const transactions = await this.transactionModel
      .find({
        fund: fundId,
        player: playerId
      })
      .lean()

    // Tạo Map để lookup nhanh: cycleId -> transaction
    const txMap = new Map(transactions.map((tx) => [tx.cycle.toString(), tx]))

    const member = (fund.members as any).find((m: any) => m.player._id.toString() === playerId)

    if (!member) return JsonResponse.error('Người chơi không thuộc dây hụi này')

    const playerInitialLegs = member.initialLegs
    const playerLegsClaimed = member.legsClaimed
    const playerLegsRemaining = playerInitialLegs - playerLegsClaimed

    // 4. Tính toán chi tiết từng kỳ
    const cyclesDetails = cycles.map((c: any) => {
      const cycleIdStr = c._id.toString()
      const transaction = txMap.get(cycleIdStr)

      const myClaimData = c.claimers?.find((cl: any) => cl.player._id.toString() === playerId)

      return {
        cycleId: c._id,
        cycleNumber: c.cycleNumber,
        payoutDate: c.payoutDate,
        closed: c.closed,
        claimers: c.claimers || [],
        isClaimedByMe: !!myClaimData,
        amountReceivedByClaimer: myClaimData ? myClaimData.amountReceived : 0,

        // Lấy từ Transaction Model
        amountDue: transaction ? transaction.amountDue : 0,
        paymentStatus: transaction ? transaction.status : 'PENDING',
        paidAt: transaction ? transaction.paidAt : null
      }
    })

    const data = {
      fund,
      playerDetails: {
        playerId,
        initialLegs: playerInitialLegs,
        legsClaimed: playerLegsClaimed,
        legsRemaining: playerLegsRemaining
      },
      cycles: cyclesDetails
    }

    return JsonResponse.success(data, MESSAGES_CODE.GET_SUCCESS)
  }

  async claimCycle(dto: ClaimCycleDTO): Promise<IJsonResponse<any>> {
    return this.cycleService.claim(dto)
  }

  async updatePaymentStatus(cycleId: string, playerId: string, isPaid: boolean) {
    return this.cycleService.updatePaymentStatus(cycleId, playerId, isPaid)
  }
}
