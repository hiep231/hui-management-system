import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateFundDTO, UpdateFundDTO, CreateFundWithMembersDTO } from '../dto/fund.dto'
import { FundModel, FundMember } from '../models/fund.model'
import { BaseService } from 'src/shares/services/mongo/base.service'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CycleModel } from 'src/modules/cycle/models/cycle.model'
import { PlayerModel } from 'src/modules/player/models/player.model'
import { JsonResponse } from 'src/shares/controllers/json.response'

interface FundGroup {
  _id: string
  funds: FundModel[]
  count: number
}

interface IFundService {
  createFund(dto: CreateFundDTO): Promise<FundModel>
  createFundWithMembers(dto: CreateFundWithMembersDTO): Promise<FundModel>
  getAllFunds(): Promise<FundModel[]>
  getFundById(fundId: string): Promise<any>
  getGroupedFunds(): Promise<FundGroup[]>
  updateFund(dto: UpdateFundDTO): Promise<FundModel>
  deleteFund(fundId: string): Promise<{ message: string }>
}

@Injectable()
export class FundService extends BaseService<FundModel> implements IFundService {
  constructor(
    @InjectModel(FundModel.name) private readonly fundModel: ModelType<FundModel>,
    @InjectModel(CycleModel.name) private readonly cycleModel: Model<any>,
    @InjectModel(PlayerModel.name) private readonly playerModel: ModelType<PlayerModel> // Cần inject PlayerModel để kiểm tra
  ) {
    super(fundModel)
  }

  async createFund(dto: CreateFundDTO) {
    const exist = await this.fundModel.findOne({ name: dto.name, startDate: dto.startDate })
    if (exist) throw new BadRequestException('Đã tồn tại dây hụi trùng tên và ngày bắt đầu')

    const start = new Date(dto.startDate)
    const end = dto.endDate
      ? new Date(dto.endDate)
      : new Date(start.getTime() + dto.totalCycles * 30 * 24 * 3600 * 1000)

    const fund = await this.fundModel.create({
      name: dto.name,
      amount: dto.amount,
      fee: dto.fee,
      totalCycles: dto.totalCycles,
      startDate: start,
      endDate: end,
      totalLegsRegistered: 0
    })

    const cycles = []
    for (let i = 1; i <= dto.totalCycles; i++) {
      cycles.push({
        fund: fund._id,
        cycleNumber: i,
        payoutDate: new Date(start.getTime() + (i - 1) * 30 * 24 * 3600 * 1000)
      })
    }
    await this.cycleModel.insertMany(cycles)

    return fund
  }

  async createFundWithMembers(dto: CreateFundWithMembersDTO) {
    const { name, amount, fee, totalCycles, startDate, endDate, players } = dto

    const exist = await this.fundModel.findOne({ name, startDate: new Date(startDate) })
    if (exist) throw new BadRequestException('Đã tồn tại dây hụi trùng tên và ngày bắt đầu')

    const totalLegsRegistered = players.reduce((sum, p) => sum + p.legs, 0)
    if (totalLegsRegistered !== totalCycles) {
      throw new BadRequestException(
        `Tổng số chân đăng ký (${totalLegsRegistered}) phải bằng tổng số kỳ (${totalCycles}) để tạo đủ dây.`
      )
    }

    const playerIds = players.map((p) => p.playerId)
    const existingPlayers = await this.playerModel.find({ _id: { $in: playerIds } }).lean()
    if (existingPlayers.length !== playerIds.length) {
      throw new NotFoundException('Có người chơi không tồn tại trong hệ thống.')
    }

    const fundMembers: FundMember[] = players.map(
      (p) =>
        ({
          player: p.playerId,
          initialLegs: p.legs,
          legsClaimed: 0,
          claimedCycleNumbers: []
        }) as FundMember
    )

    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date(start.getTime() + totalCycles * 30 * 24 * 3600 * 1000)

    const fund = await this.fundModel.create({
      name,
      amount,
      fee,
      totalCycles,
      startDate: start,
      endDate: end,
      members: fundMembers,
      totalLegsRegistered
    })

    const cycles = []
    for (let i = 1; i <= totalCycles; i++) {
      cycles.push({
        fund: fund._id,
        cycleNumber: i,
        payoutDate: new Date(start.getTime() + (i - 1) * 30 * 24 * 3600 * 1000)
      })
    }
    await this.cycleModel.insertMany(cycles)

    return fund
  }

  async getAllFunds() {
    return this.fundModel.find({ isDelete: false }).populate('members.player').sort({ createdAt: -1 }).lean()
  }

  async getFundById(fundId: string) {
    const fund = await this.fundModel.findOne({ _id: fundId, isDelete: false }).populate('members.player').lean()

    if (!fund) throw new NotFoundException('Không tìm thấy dây hụi hoặc dây đã bị xóa')

    const cycles = await this.cycleModel.find({ fund: fundId }).sort({ cycleNumber: 1 }).lean()
    return { ...fund, cycles }
  }

  async getGroupedFunds(): Promise<any> {
    const groups = await this.fundModel.aggregate([
      {
        $match: {
          isDelete: false
        }
      },
      {
        $group: {
          _id: {
            amount: '$amount',
            fee: '$fee',
            totalCycles: '$totalCycles',
            startYear: { $year: '$startDate' },
            startMonth: { $month: '$startDate' }
          },
          funds: { $push: '$$ROOT' },
          count: { $sum: 1 },

          amount: { $first: '$amount' },
          startDate: { $first: '$startDate' }
        }
      },
      {
        $sort: {
          amount: -1,
          startDate: -1,
          count: -1
        }
      }
    ])
    return groups
  }

  async updateFund(dto: UpdateFundDTO) {
    const fund = await this.fundModel.findById(dto.fundId)
    if (!fund) throw new NotFoundException('Không tìm thấy dây hụi')

    if (dto.totalCycles && fund.totalLegsRegistered > dto.totalCycles) {
      throw new BadRequestException(`Không thể giảm tổng số kỳ. Tổng chân đã đăng ký là ${fund.totalLegsRegistered}`)
    }

    Object.assign(fund, dto)
    await fund.save()
    return fund
  }

  async deleteFund(fundId: string) {
    const fund = await this.fundModel.findById(fundId)
    if (!fund) throw new NotFoundException('Không tìm thấy dây hụi')
    fund.isDelete = true

    await fund.save()
    return { message: 'Đã xóa dây hụi thành công' }
  }

  async deleteManyFunds(ids: string[]) {
    if (!ids || ids.length === 0) return

    await this.fundModel.updateMany({ _id: { $in: ids } }, { $set: { isDelete: true } })

    return { message: `Đã xóa ${ids.length} dây hụi` }
  }

  async closeFund(fundId: string) {
    const fund = await this.fundModel.findById(fundId)
    if (!fund) throw new NotFoundException('Không tìm thấy dây hụi')

    fund.status = false
    fund.endDate = new Date()

    await fund.save()
    return { message: 'Đã kết thúc dây hụi thành công', fund }
  }
}
