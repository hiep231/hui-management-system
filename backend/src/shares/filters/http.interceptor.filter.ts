import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
  HttpStatus,
  Body
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Observable, TimeoutError } from 'rxjs'
import { catchError, tap, timeout } from 'rxjs/operators'
import { Reflector } from '@nestjs/core'
import { LoggerService } from '../logger/logger.service'
import { JwtObject } from '../services/auth/services/auth.service'
import { USER_CONTEXT } from '../constants/key.constant'

@Injectable()
export class HttpInterceptorFilter implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly loggerService: LoggerService
  ) {}

  getUserContext = (authorization: any) => {
    try {
      if (!authorization) {
        throw new HttpException('Token Invalid', HttpStatus.UNAUTHORIZED)
      }
      const [, token] = authorization.split(' ')
      if (!token) {
        throw new HttpException('Token Invalid', HttpStatus.UNAUTHORIZED)
      }

      const jwtDecode = this.jwtService.decode(token)
      const jwtObject: JwtObject = JSON.parse(JSON.stringify(jwtDecode))
      if (jwtObject) {
        return jwtObject
      }
      return null
    } catch (error) {
      throw new HttpException(error?.message, error?.status || 200)
    }
  }

  getUserContextAnonymous = (authorization: any) => {
    try {
      if (authorization) {
        const [, token] = authorization.split(' ')
        if (token) {
          const jwtDecode = this.jwtService.decode(token)
          const jwtObject: JwtObject = JSON.parse(JSON.stringify(jwtDecode))
          if (jwtObject) {
            return jwtObject
          }
        }
      }
      return null
    } catch (error) {
      throw new HttpException(error?.message, error?.status || 200)
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()

    const anonymous = this.reflector.getAllAndOverride('anonymous', [context.getHandler(), context.getClass()])
    if (anonymous) {
      const jwtObject: JwtObject = this.getUserContextAnonymous(request.headers.authorization)
      if (jwtObject) {
        this.loggerService.logRequest(
          `${request.method} ${request.url}`,
          JSON.stringify(jwtObject),
          JSON.stringify(request.body)
        )
      } else {
        this.loggerService.logRequest(`${request.method} ${request.url}`, 'anonymous', JSON.stringify(request.body))
      }
    }

    if (!request.body[USER_CONTEXT] && !anonymous) {
      try {
        const jwtObject: JwtObject = this.getUserContext(request.headers.authorization)
        if (jwtObject) {
          request.body[USER_CONTEXT] = jwtObject

          this.loggerService.logRequest(
            `${request.method} ${request.url}`,
            JSON.stringify(jwtObject),
            JSON.stringify(request.body)
          )
        }
      } catch (error) {
        throw new HttpException(error?.message, error?.status || 200)
      }
    }

    if (request.headers['content-type'] && request.headers['content-type'].includes('multipart/form-data')) {
      request[USER_CONTEXT] = request.body[USER_CONTEXT]
    }

    return next.handle().pipe(
      tap((responseBody: any) => {
        if (responseBody?.success == false) {
          throw new HttpException(responseBody?.message, 200)
        }
      })
    )
  }
}
