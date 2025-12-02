import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

const DEFAULT_PAGESIZE = 10;
const DEFAULT_PAGE = 0;

/**
 * @param data - Object params limit default by Backend Developers
 * @param ctx - ExecutionContext
 * @returns Object with Type of IPaging
 * @example
 * {
 * 	pageSize: 10,
 * 	page: 0
 * }
 */
export const Paging = createParamDecorator(
	(data: { pageSize?: number }, ctx: ExecutionContext) => {
		const request: Request = ctx.switchToHttp().getRequest();

		let pageSize = DEFAULT_PAGESIZE;
		let page = DEFAULT_PAGE;

		if (data?.pageSize) {
			pageSize = parseInt(data?.pageSize.toString());
		}
		if (request.query?.pageSize) {
			pageSize = parseInt(request.query?.pageSize.toString());
		}
		if (request.query?.page) {
			page = parseInt(request.query?.page.toString());
		}

		return {
			pageSize,
			page
		};
	}
);
