import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from 'src/shares/config/configService.service'
import { LoggerService } from 'src/shares/logger/logger.service'

export interface IAuthResponse {
  accessToken: string
  expire: number
}

export interface JwtObject {
  phone: string
  email: string
}

export interface IAuthService {
  createToken(payload: JwtObject, refresh: boolean): Promise<IAuthResponse>
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService
  ) {}

  async createToken(payload: JwtObject): Promise<IAuthResponse> {
    try {
      const accessToken = this.jwtService.sign(payload)

      return {
        accessToken: accessToken,
        expire: parseInt(this.configService.get('EXPIRESIN'))
      }
    } catch (error) {
      this.loggerService.error('AuthService', this.createToken.name, error)
    }
    return {
      accessToken: null,
      expire: 0
    }
  }

  async validateToken(token: string): Promise<any> {
    try {
      const payload = await this.jwtService.verifyAsync(token)

      return payload
    } catch (error) {
      this.loggerService.error('AuthService', this.validateToken.name, error)
      throw new UnauthorizedException('Invalid or expired token')
    }
  }
}
