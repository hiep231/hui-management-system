import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
import _ from 'lodash'
import { IQueryBodyAllowField } from './queryBody.interface'

export const QueryBody = createParamDecorator((fieldsAllow: IQueryBodyAllowField, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest()
  let resultObject = { sort: {}, populate: [] }
  let sortObject = _.cloneDeep(request.body?.sort)
  if (sortObject) {
    const fieldsSortRequest = Object.keys(sortObject)
    fieldsSortRequest.forEach((fieldSort) => {
      if (!fieldsAllow.sort.includes(fieldSort)) {
        delete sortObject[fieldSort]
      }
    })
    resultObject.sort = sortObject
  }
  let fieldsPopulateRequest = _.cloneDeep(request.body?.populate)
  if (fieldsPopulateRequest) {
    fieldsPopulateRequest.forEach((fieldPopulate: string) => {
      if (!fieldsAllow.populate.includes(fieldPopulate)) {
        fieldsPopulateRequest = _.pull(fieldsPopulateRequest, fieldPopulate)
      }
    })
    resultObject.populate = fieldsPopulateRequest
  }
  return resultObject
})
