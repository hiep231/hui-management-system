import { Controller, Post, Get, Put, Delete, Param, Body, HttpStatus, HttpCode } from '@nestjs/common'
import { FundService } from '../services/fund.service'
import { CreateFundDTO, UpdateFundDTO, CreateFundWithMembersDTO } from '../dto/fund.dto'
import { JsonResponse, IJsonResponse } from 'src/shares/controllers/json.response'
import { FundModel } from '../models/fund.model'
import { MESSAGES_CODE } from 'src/shares/constants/status.constants'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Funds')
@Controller('funds')
export class FundController {
  constructor(private readonly fundService: FundService) {}

  @Post()
  async createFund(@Body() dto: CreateFundDTO): Promise<IJsonResponse<FundModel>> {
    try {
      const result = await this.fundService.createFund(dto)
      return JsonResponse.success(result, MESSAGES_CODE.CREATED_SUCCESS)
    } catch (error) {
      return JsonResponse.error(error.message, null, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('with-members')
  @HttpCode(HttpStatus.CREATED)
  async createFundWithMembers(@Body() dto: CreateFundWithMembersDTO): Promise<IJsonResponse<FundModel>> {
    try {
      const result = await this.fundService.createFundWithMembers(dto)
      return JsonResponse.success(result, MESSAGES_CODE.CREATED_SUCCESS)
    } catch (error) {
      return JsonResponse.error(error.message, null, HttpStatus.BAD_REQUEST)
    }
  }

  @Get()
  async getAllFunds(): Promise<IJsonResponse<FundModel[]>> {
    try {
      const result: FundModel[] = await this.fundService.getAllFunds()
      return JsonResponse.success<FundModel[]>(result, MESSAGES_CODE.GET_LIST_SUCCESS)
    } catch (error) {
      return JsonResponse.error(error.message, null, HttpStatus.BAD_REQUEST)
    }
  }

  @Post(':id/close')
  async closeFund(@Param('id') id: string): Promise<IJsonResponse<any>> {
    try {
      const result = await this.fundService.closeFund(id)
      return JsonResponse.success(result, MESSAGES_CODE.UPDATED_SUCCESS)
    } catch (error) {
      return JsonResponse.error(error.message, null, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('grouped')
  async getGroupedFunds(): Promise<IJsonResponse<any>> {
    try {
      const result = await this.fundService.getGroupedFunds()
      return JsonResponse.success(result, MESSAGES_CODE.GET_LIST_SUCCESS)
    } catch (error) {
      return JsonResponse.error(error.message, null, HttpStatus.BAD_REQUEST)
    }
  }

  @Get(':id')
  async getFundById(@Param('id') id: string): Promise<IJsonResponse<any>> {
    try {
      const result = await this.fundService.getFundById(id)
      return JsonResponse.success(result, MESSAGES_CODE.GET_SUCCESS)
    } catch (error) {
      return JsonResponse.error(error.message, null, HttpStatus.NOT_FOUND)
    }
  }

  @Post('update')
  async updateFund(@Body() dto: UpdateFundDTO): Promise<IJsonResponse<FundModel>> {
    try {
      const result = await this.fundService.updateFund(dto)
      return JsonResponse.success(result, MESSAGES_CODE.UPDATED_SUCCESS)
    } catch (error) {
      return JsonResponse.error(error.message, null, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('delete/:id')
  async deleteFund(@Param('id') id: string): Promise<IJsonResponse<{ message: string }>> {
    try {
      const result = await this.fundService.deleteFund(id)
      return JsonResponse.success(result, MESSAGES_CODE.DELETED_SUCCESS)
    } catch (error) {
      return JsonResponse.error(error.message, null, HttpStatus.NOT_FOUND)
    }
  }

  @Post('delete-many')
  async deleteManyFunds(@Body() body: { ids: string[] }): Promise<IJsonResponse<any>> {
    try {
      const result = await this.fundService.deleteManyFunds(body.ids)
      return JsonResponse.success(result, MESSAGES_CODE.DELETED_SUCCESS)
    } catch (error) {
      return JsonResponse.error(error.message, null, HttpStatus.BAD_REQUEST)
    }
  }
}
