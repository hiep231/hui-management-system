import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common'
import { PlayerService } from '../services/player.service'
import { CreatePlayerDTO, JoinFundDTO, UpdatePlayerDTO } from '../dto/player.dto'
import { ClaimCycleDTO } from '../dto/cycle.dto'
import { JsonResponse, IJsonResponse } from 'src/shares/controllers/json.response'
import { FundModel } from 'src/modules/fund/models/fund.model'
import { PlayerModel } from '../models/player.model'
import { ApiTags } from '@nestjs/swagger'
import { MESSAGES_CODE } from 'src/shares/constants/status.constants'
import { CreateFundDTO } from 'src/modules/fund/dto/fund.dto'

@ApiTags('Players')
@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  async createPlayer(@Body() dto: CreatePlayerDTO): Promise<IJsonResponse<PlayerModel>> {
    try {
      const result = await this.playerService.createPlayer(dto)
      return JsonResponse.success(result, MESSAGES_CODE.CREATED_SUCCESS)
    } catch (error) {
      return JsonResponse.error(error.message, null, HttpStatus.BAD_REQUEST)
    }
  }

  @Get()
  async getAll(): Promise<IJsonResponse<PlayerModel[]>> {
    try {
      const result = await this.playerService.getAllPlayers()
      return JsonResponse.success<PlayerModel[]>(result, MESSAGES_CODE.GET_LIST_SUCCESS)
    } catch (error) {
      return JsonResponse.error(error.message, null, HttpStatus.BAD_REQUEST)
    }
  }

  @Post(':id')
  async updatePlayer(@Param('id') id: string, @Body() dto: UpdatePlayerDTO): Promise<IJsonResponse<PlayerModel>> {
    try {
      const result = await this.playerService.updatePlayer(id, dto)
      return JsonResponse.success(result, MESSAGES_CODE.UPDATED_SUCCESS)
    } catch (error) {
      return JsonResponse.error(error.message, null, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('groups/funds')
  async getFundsGrouped(): Promise<IJsonResponse<any>> {
    try {
      const result = await this.playerService.getFundsGrouped()
      return JsonResponse.success(result, MESSAGES_CODE.GET_LIST_SUCCESS)
    } catch (error) {
      return JsonResponse.error(error.message, null, HttpStatus.BAD_REQUEST)
    }
  }

  @Get(':id')
  async getPlayer(@Param('id') id: string): Promise<IJsonResponse<any>> {
    try {
      const result = await this.playerService.getPlayerById(id)
      return JsonResponse.success(result, MESSAGES_CODE.GET_SUCCESS)
    } catch (error) {
      return JsonResponse.error(error.message, null, HttpStatus.NOT_FOUND)
    }
  }

  @Post('delete/:id')
  async deletePlayer(@Param('id') id: string): Promise<IJsonResponse<any>> {
    try {
      const result = await this.playerService.deletePlayer(id)
      return JsonResponse.success(result, MESSAGES_CODE.DELETED_SUCCESS)
    } catch (error) {
      return JsonResponse.error(error.message, null, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('join-fund')
  async joinFund(@Body() dto: JoinFundDTO): Promise<IJsonResponse<any>> {
    try {
      const result = await this.playerService.joinFund(dto)
      return JsonResponse.success(result, MESSAGES_CODE.UPDATED_SUCCESS)
    } catch (error) {
      return JsonResponse.error(error.message, null, HttpStatus.BAD_REQUEST)
    }
  }

  @Get(':id/funds')
  async getPlayerFunds(@Param('id') id: string): Promise<IJsonResponse<FundModel[]>> {
    try {
      const result = await this.playerService.getFundsByPlayer(id)
      return JsonResponse.success<FundModel[]>(result, MESSAGES_CODE.GET_LIST_SUCCESS)
    } catch (error) {
      return JsonResponse.error(error.message, null, HttpStatus.NOT_FOUND)
    }
  }

  @Get(':id/fund/:fundId')
  async getFundDetail(@Param('id') id: string, @Param('fundId') fundId: string): Promise<IJsonResponse<any>> {
    try {
      // Logic đã được chuyển hết vào PlayerService.getFundDetail để trả về JsonResponse
      return this.playerService.getFundDetail(id, fundId)
    } catch (error) {
      return JsonResponse.error(error.message, null, HttpStatus.NOT_FOUND)
    }
  }

  @Post('fund')
  async createFund(@Body() dto: CreateFundDTO): Promise<IJsonResponse<FundModel>> {
    try {
      const result = await this.playerService.createFund(dto as any) // Ép kiểu vì thực chất gọi FundService
      return JsonResponse.success<FundModel>(result, MESSAGES_CODE.CREATED_SUCCESS)
    } catch (error) {
      return JsonResponse.error(error.message, null, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('claim')
  @HttpCode(HttpStatus.OK)
  async claimCycle(@Body() dto: ClaimCycleDTO): Promise<IJsonResponse<any>> {
    try {
      return this.playerService.claimCycle(dto)
    } catch (error) {
      return JsonResponse.error(error.message, null, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('cycle/:cycleId/payment/:playerId')
  @HttpCode(HttpStatus.OK)
  async updatePaymentStatus(
    @Param('cycleId') cycleId: string,
    @Param('playerId') playerId: string,
    @Body('isPaid') isPaid: boolean
  ): Promise<IJsonResponse<any>> {
    try {
      const cycle = await this.playerService.updatePaymentStatus(cycleId, playerId, isPaid)
      return JsonResponse.success(cycle, MESSAGES_CODE.UPDATED_SUCCESS)
    } catch (error) {
      return JsonResponse.error(error.message, null, HttpStatus.BAD_REQUEST)
    }
  }
}
