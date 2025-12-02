import { IPaging } from './decorators/paging/paging.interface'
import { IQueryBody } from './decorators/queryBody/queryBody.interface'
import { ISearch } from './decorators/search/search.interface'

export interface IPayloadSearch {
  paging: IPaging
  search: ISearch
  queryBody: IQueryBody
}

export interface IPayloadGet {
  id?: string
  userContext?: UserContext
}

export interface IPayloadGets {
  ids?: string[]
  userContext?: IUserContext
}

export interface IPayloadPost<T> {
  id?: string
  dto: T
}

export interface IPayloadPosts<T> {
  ids?: string[]
  dtos?: T[]
  userContext?: IUserContext
}

export class UserContext {
  userContext: IUserContext
}

export interface IUserContext {
  phone: string
  email: string
}
