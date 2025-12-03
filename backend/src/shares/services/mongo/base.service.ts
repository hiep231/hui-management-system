import { Inject, Injectable } from '@nestjs/common'
import { BASE_SERVICE } from '../../constants/services.constant'
import { IQueryBody } from '../../controllers/decorators/queryBody/queryBody.interface'
import { ISearch } from '../../controllers/decorators/search/search.interface'
import { LoggerService } from '../../logger/logger.service'
import { ModelType } from '@typegoose/typegoose/lib/types'
import mongoose, { FilterQuery, UpdateQuery } from 'mongoose'
import { ISearchResponse } from './base.service.interface'

interface IBaseService<T> {
  get(conditions: FilterQuery<T>, select: any, populates: any): Promise<T | any>
  getAll(conditions: FilterQuery<T>, select: any, populates: any): Promise<T[] | any>
  getById(_id: string): Promise<T | any>
  getList(
    conditions: FilterQuery<T>,
    skip: number,
    limit: number,
    search: ISearch,
    sort: IQueryBody,
    select: any,
    populates: any
  ): Promise<ISearchResponse<T[]> | any>
  save(data: Partial<T>, index: boolean): Promise<T | any>
  saveById(_id: mongoose.Types.ObjectId, data: Partial<T>, index: boolean): Promise<T | any>
  saveMany(datas: Partial<T[]>, index: boolean): Promise<T[] | any>
  updateMany(conditions: FilterQuery<T>, dataUpdate: UpdateQuery<T>, index: boolean): Promise<T | any>
  updateOne(conditions: FilterQuery<T>, dataUpdate: UpdateQuery<T>, index: boolean, ignores: string[]): Promise<T | any>
  count(conditions: FilterQuery<T>): Promise<number>
}

@Injectable()
export class BaseService<T> implements IBaseService<T> {
  @Inject(LoggerService)
  private readonly loggerBaseService: LoggerService

  protected _model: ModelType<T>

  protected get modelName(): string {
    return this._model.modelName
  }

  constructor(model: ModelType<T>) {
    this._model = model
  }

  // :::::::::::::::::::::::::::::::::::::::::::::::::  MONGO DB  ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  /**
   * @param conditions Model query
   * @returns The first document that match the model query conditions
   */
  async get(conditions: FilterQuery<T> = {}, select = null, populates = []): Promise<T | any> {
    try {
      const queryPromisePipeline = this._model.findOne(conditions)

      populates.forEach((populate) => {
        queryPromisePipeline.populate(populate)
      })

      if (select) {
        queryPromisePipeline.select(select)
      }

      const result = await queryPromisePipeline.lean()
      return result
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * @param conditions Model query
   * @returns The first document that match the model query conditions
   */
  async getAll(conditions: FilterQuery<T> = {}, select = null, populates = []): Promise<T[] | any> {
    try {
      const queryPromisePipeline = this._model.find(conditions)

      if (select) {
        queryPromisePipeline.select(select)
      }

      populates.forEach((populate) => {
        queryPromisePipeline.populate(populate)
      })

      const result = await queryPromisePipeline.lean()
      return result
    } catch (error) {
      throw new Error(error)
    }
  }

  async getById(_id: string): Promise<T | any> {
    try {
      const queryPromisePipeline = this._model.findOne({ _id: _id, isDelete: false })

      const result = await queryPromisePipeline.lean()
      return result
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * @param conditions Model query
   * @param page
   * @param pageSize
   * @param select Select object
   * @param sort Sort object
   * @param populates List populates
   * @param search Keyword search
   * @returns List documents matching params
   */
  async getList(
    conditions: FilterQuery<T> = {},
    page = 0,
    pageSize = 0,
    search = null,
    sort = null,
    select = null,
    populates = []
  ): Promise<ISearchResponse<T[]> | any> {
    const startTime = Date.now()
    try {
      if (search) {
        conditions = { ...conditions, $text: { $search: `"${search}"` } }
      }
      let queryPromisePipeline = this._model.find(conditions)
      populates.forEach((populate) => {
        const populateArray: string[] = populate.split('.')
        if (populateArray.length == 1) {
          queryPromisePipeline.populate({ path: populateArray[0] })
        } else {
          queryPromisePipeline.populate({ path: populateArray[0], populate: { path: populateArray[1] } })
        }
      })

      if (page && pageSize >= 0) {
        queryPromisePipeline = queryPromisePipeline.skip(pageSize * page)
      }
      if (pageSize && pageSize >= 0) {
        queryPromisePipeline = queryPromisePipeline.limit(pageSize)
      }
      const totalRecords = await this._model.estimatedDocumentCount(conditions)

      if (sort) {
        queryPromisePipeline = queryPromisePipeline.sort(sort)
      }

      if (select) {
        queryPromisePipeline.select(select)
      }

      const results: Array<any> = await queryPromisePipeline.lean()
      return {
        response: results,
        page: {
          currentPage: page,
          pageSize: pageSize,
          total: results.length || 0,
          totalPages: Math.ceil(totalRecords / pageSize) || -1,
          totalRecords: totalRecords || -1
        },
        time: {
          currentTime: Date.now(),
          timeTaken: Date.now() - startTime
        }
      }
    } catch (error) {
      this.loggerBaseService.error(BASE_SERVICE.serviceName, this.getList.name, error.toString())
      return {
        response: [],
        page: {
          currentPage: page,
          pageSize: pageSize,
          total: 0,
          totalPages: -1,
          totalRecords: -1
        },
        time: {
          currentTime: Date.now(),
          timeTaken: Date.now() - startTime
        }
      }
    }
  }

  async save(data: Partial<T>, index: boolean = true): Promise<T | any> {
    try {
      const _id = new mongoose.Types.ObjectId()
      const result = await new this._model({ ...data, _id }).save()

      return result
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * @param data Datas model
   * @returns Documents saved
   */
  async saveMany(datas: Partial<T[]>, index: boolean = true): Promise<T[] | any> {
    try {
      datas.forEach((data: T) => {
        data['_id'] = new mongoose.Types.ObjectId()
      })

      const results = await this._model.insertMany(datas)

      return results
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * @param data Data model
   * @returns Document saved
   */
  async saveById(_id: mongoose.Types.ObjectId, data: Partial<T>, index: boolean = true): Promise<T | any> {
    try {
      const result = await new this._model({ ...data, _id }).save()
      return result
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * @param dataUpdate Data model
   * @returns Document updated
   */
  async updateMany(
    conditions: FilterQuery<T> = {},
    dataUpdate: UpdateQuery<T>,
    index: boolean = true
  ): Promise<T[] | any> {
    try {
      const result = await this._model
        .updateMany(conditions, {
          $set: dataUpdate
        })
        .lean()

      return result
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * @param dataUpdate Data model
   * @returns Document updated
   */
  async updateOne(
    conditions: FilterQuery<T> = {},
    dataUpdate: UpdateQuery<T>,
    index: boolean = true,
    ignores: string[] = []
  ): Promise<T | any> {
    try {
      const result = await this._model.findOneAndUpdate(conditions, { $set: dataUpdate }, { new: true }).lean()
      // if (index && result != null) {
      // 	if (ignores.length) {
      // 		ignores.forEach(field => {
      // 			delete result[field]
      // 		})
      // 	}
      // 	this._esInstance.updateById(result?._id || result?.id, result);
      // }

      return result
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * @param conditions Model query
   * @returns Number
   */
  async count(conditions: FilterQuery<T> = {}): Promise<number> {
    try {
      const result: number = await this._model.estimatedDocumentCount(conditions)
      return result
    } catch (error) {
      throw new Error(error)
    }
  }
}
