import { IPageResponse, ITimeResponse, IMappingObjectResponse } from '../services/mongo/base.service.interface'
import { MESSAGES_CODE } from '../constants/status.constants'

export interface IJsonResponse<T> {
  success: boolean
  message: string | null
  from?: number
  size?: number
  total?: number
  totalRecords?: number
  data: T | T[] | null
  moreInfo?: any
  page?: IPageResponse
  time?: ITimeResponse
  mappingObject?: IMappingObjectResponse<any>
}

export class JsonResponse<T> implements IJsonResponse<T> {
  public success: boolean
  public data: T | T[] | null
  public message: string | null = null
  public from?: number
  public size?: number
  public total?: number
  public totalRecords?: number
  public moreInfo?: any
  public page?: IPageResponse
  public time?: ITimeResponse
  public mappingObject?: IMappingObjectResponse<any>

  constructor(success: boolean, data: T | T[] | null = null, message: string = MESSAGES_CODE.GET_SUCCESS) {
    this.success = success
    this.data = data
    this.message = message
  }

  setList(list: T[], totalRecords: number, paging: { page: number; pageSize: number }, time?: ITimeResponse) {
    this.data = list
    this.from = paging.page * paging.pageSize
    this.size = paging.pageSize
    this.total = list.length
    this.totalRecords = totalRecords
    this.time = time
    return this
  }

  static error(message: string, data: any = null, status: number = 400): IJsonResponse<any> {
    return {
      success: false,
      message: message,
      data: data,
      moreInfo: { statusCode: status },
      from: 0,
      size: 0,
      total: 0
    }
  }

  static success<T>(
    data: T | T[],
    message: string = MESSAGES_CODE.GET_SUCCESS,
    moreInfo: any = null
  ): IJsonResponse<T> {
    return {
      success: true,
      message: message,
      data: data,
      moreInfo: moreInfo
    }
  }
}
