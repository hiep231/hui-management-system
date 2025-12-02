import { Controller, Get, Post, Put, Param, Body, HttpStatus, Query } from '@nestjs/common'
import { CycleService } from '../services/cycle.service'
import { CreateCycleDTO, UpdateCycleDTO, ClaimCycleDTO } from '../dto/cycle.dto'
import { JsonResponse, IJsonResponse } from 'src/shares/controllers/json.response'
import { CycleModel } from '../models/cycle.model'
import { MESSAGES_CODE } from 'src/shares/constants/status.constants'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Cycles')
@Controller('cycles')
export class CycleController {
  constructor(private readonly cycleService: CycleService) {}

  @Post()
  async createCycle(@Body() dto: CreateCycleDTO): Promise<IJsonResponse<CycleModel>> {
    try {
      const result = await this.cycleService.createCycle(dto)
      return JsonResponse.success(result, MESSAGES_CODE.CREATED_SUCCESS)
    } catch (error) {
      return JsonResponse.error(error.message, null, HttpStatus.BAD_REQUEST)
    }
  }

  @Get()
  async getAllCycles(): Promise<IJsonResponse<CycleModel[]>> {
    try {
      const result = await this.cycleService.getAllCycles()
      return JsonResponse.success<CycleModel[]>(result, MESSAGES_CODE.GET_LIST_SUCCESS)
    } catch (error) {
      return JsonResponse.error(error.message, null, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('fund/:fundId')
  async getCyclesByFund(@Param('fundId') fundId: string): Promise<IJsonResponse<CycleModel[]>> {
    try {
      const result = await this.cycleService.getCyclesByFund(fundId)
      return JsonResponse.success<CycleModel[]>(result, MESSAGES_CODE.GET_LIST_SUCCESS)
    } catch (error) {
      return JsonResponse.error(error.message, null, HttpStatus.NOT_FOUND)
    }
  }

  @Get('stats')
  async getStats(
    @Query('date') date: string,
    @Query('type') type: 'day' | 'month' | 'year'
  ): Promise<IJsonResponse<any>> {
    try {
      const targetDate = date || new Date().toISOString()
      const targetType = type || 'day'

      const result = await this.cycleService.getStats(targetDate, targetType)

      return JsonResponse.success(result, MESSAGES_CODE.GET_SUCCESS)
    } catch (error) {
      return JsonResponse.error(error.message, null, HttpStatus.BAD_REQUEST)
    }
  }

  @Get(':id')
  async getCycleDetail(@Param('id') id: string): Promise<IJsonResponse<CycleModel>> {
    try {
      const result = await this.cycleService.getCycleDetail(id)
      return JsonResponse.success(result, MESSAGES_CODE.GET_SUCCESS)
    } catch (error) {
      return JsonResponse.error(error.message, null, HttpStatus.NOT_FOUND)
    }
  }

  @Post('update')
  async updateCycle(@Body() dto: UpdateCycleDTO): Promise<IJsonResponse<CycleModel>> {
    try {
      const result = await this.cycleService.updateCycle(dto)
      return JsonResponse.success(result, MESSAGES_CODE.UPDATED_SUCCESS)
    } catch (error) {
      return JsonResponse.error(error.message, null, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('close/:id')
  async closeCycle(@Param('id') id: string): Promise<IJsonResponse<{ message: string }>> {
    try {
      const result = await this.cycleService.closeCycle(id)
      return JsonResponse.success(result, MESSAGES_CODE.UPDATED_SUCCESS)
    } catch (error) {
      return JsonResponse.error(error.message, null, HttpStatus.NOT_FOUND)
    }
  }

  @Post('claim')
  async claim(@Body() dto: ClaimCycleDTO): Promise<IJsonResponse<any>> {
    return this.cycleService.claim(dto)
  }

  @Post('unclaim')
  async unclaim(@Body() dto: { fundId: string; cycleId: string }): Promise<IJsonResponse<any>> {
    return this.cycleService.unclaim(dto)
  }
}
