import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { Request, Response } from 'express'
import { LoggerService } from '../logger/logger.service'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    if (request) {
      const status = exception.getStatus() ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

      const errorResponse = {
        success: false,
        // code: status,
        result: null,
        // error: status != HttpStatus.INTERNAL_SERVER_ERROR ? exception.message || null : 'Internal server error',
        message:
          typeof exception.getResponse() === 'object'
            ? (exception.getResponse() as any).message
            : exception.getResponse()
      }

      this.loggerService.exception(
        `${request.method} ${request.url}`,
        status === HttpStatus.INTERNAL_SERVER_ERROR ? exception.stack : JSON.stringify(errorResponse)
      )

      return response.status(status).json(errorResponse)
    } else {
      return exception
    }
  }
}
