import { IPageResponse, ITimeResponse, IMappingObjectResponse } from '../services/mongo/base.service.interface'
import { MESSAGES_CODE } from '../constants/status.constants'

/**
 * Interface thống nhất cho tất cả các API Response
 */
export interface IJsonResponse<T> {
  success: boolean
  message: string | null
  from?: number // Bắt đầu từ bản ghi nào (cho danh sách)
  size?: number // Số lượng bản ghi mỗi trang (cho danh sách)
  total?: number // Tổng số bản ghi trong data (cho danh sách)
  totalRecords?: number // Tổng số bản ghi trong DB (cho danh sách)
  data: T | T[] | null // Dữ liệu trả về (object hoặc array)
  moreInfo?: any // Thông tin thêm, ví dụ: { formula: {...} }
  page?: IPageResponse // Thông tin phân trang chi tiết
  time?: ITimeResponse // Thời gian xử lý
  mappingObject?: IMappingObjectResponse<any>
}

// Cập nhật lại lớp JsonResponse để tuân thủ cấu trúc mới
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

  // Dành cho response dạng danh sách (getList)
  setList(list: T[], totalRecords: number, paging: { page: number; pageSize: number }, time?: ITimeResponse) {
    this.data = list
    this.from = paging.page * paging.pageSize
    this.size = paging.pageSize
    this.total = list.length
    this.totalRecords = totalRecords
    this.time = time
    return this
  }

  // Dành cho response khi có lỗi
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

  // Dành cho response thành công
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
