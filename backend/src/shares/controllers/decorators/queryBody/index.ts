import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import _ from 'lodash';
import { IQueryBodyAllowField } from './queryBody.interface';

/**
 * @param data - Object fieldsAllow default by Backend Developers
 * @param ctx - ExecutionContext
 * @returns Object with Type of IQueryBodyAllowField (Sort and Populate)
 * @example
 * {sort: {fieldName1: number, fieldName2: number,...}, populate:['nameFiel', 'nameField2',...]}
 */
export const QueryBody = createParamDecorator(
	(fieldsAllow: IQueryBodyAllowField, ctx: ExecutionContext) => {
		const request: Request = ctx.switchToHttp().getRequest();
		let resultObject = { sort: {}, populate: [] };
		let sortObject = _.cloneDeep(request.body?.sort);
		if (sortObject) {
			const fieldsSortRequest = Object.keys(sortObject);
			// check fieldsSortAllow 
			fieldsSortRequest.forEach(fieldSort => {
				if (!fieldsAllow.sort.includes(fieldSort)) {
					delete sortObject[fieldSort];
				}
			});
			resultObject.sort = sortObject;
		}
		let fieldsPopulateRequest = _.cloneDeep(request.body?.populate);
		if (fieldsPopulateRequest) {
			// check fieldsPopulateAllow 
			fieldsPopulateRequest.forEach((fieldPopulate: string) => {
				if (!fieldsAllow.populate.includes(fieldPopulate)) {
					fieldsPopulateRequest = _.pull(fieldsPopulateRequest, fieldPopulate);
				}
			});
			resultObject.populate = fieldsPopulateRequest;
		}
		return resultObject;
	}
);
