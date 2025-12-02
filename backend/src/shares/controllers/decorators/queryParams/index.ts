import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import _ from 'lodash';

/**
 * @param data - Object fieldsQueryAllow (queryByField) default by Backend Developers
 * @param ctx - ExecutionContext
 * @returns Object with Type of IPrams
 * @example
 * {fieldName1: any, fieldName2: any,...}
 */
export const QueryParams = createParamDecorator(
	(fieldsQueryAllow: string[], ctx: ExecutionContext) => {
		const request: Request = ctx.switchToHttp().getRequest();

		let queryObject = _.cloneDeep(request.query);
		if (queryObject) {
			const fieldsQueryRequest = Object.keys(queryObject);
			// check fieldsQueryAllow 
			fieldsQueryRequest.forEach(fieldQuery => {
				if (!fieldsQueryAllow.includes(fieldQuery)) {
					delete queryObject[fieldQuery];
				}
			});
			return queryObject;
		}
		return {};
	}
);
