import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

const DEFAULT_SEARCH = '';

/**
 * @param ctx - ExecutionContext
 * @returns Object with Type of IPaging
 * @example
 * {textSearch: 'keyword'}
 */
export const Search = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const request: Request = ctx.switchToHttp().getRequest();
		if (request.query?.search) {
			const textSearch = request.query?.search || DEFAULT_SEARCH;
			return { textSearch: textSearch };
		}
		return { textSearch: '' };
	}
);
