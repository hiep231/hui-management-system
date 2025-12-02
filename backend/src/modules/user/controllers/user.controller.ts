import { BadRequestException, Body, Controller, Get, Post, Query, Req, Res, HttpStatus } from '@nestjs/common'
import { UserService } from '../services/user.service'
import { IPayloadPost } from 'src/shares/controllers/payload.interface'
import { UserDTO } from '../dto/user.dto'
import { JsonResponse, IJsonResponse } from 'src/shares/controllers/json.response'
import { UserModel } from '../models/user.model'
import { MESSAGES_CODE } from 'src/shares/constants/status.constants'
import { ACCOUNT_SERVICE } from 'src/shares/constants/services.constant'
import { LoggerService } from 'src/shares/logger/logger.service'
import { LoginUserDTO, LoginUserResponseDTO } from '../dto/login.dto'
import { FilterQuery } from 'mongoose'
import { IParams } from 'src/shares/controllers/decorators/queryParams/params.interface'
import { ApiTags, ApiBody, ApiResponse, ApiHeader } from '@nestjs/swagger'
import { AuthService } from 'src/shares/services/auth/services/auth.service'
import { Response, Request } from 'express'

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly loggerService: LoggerService,
    private readonly authService: AuthService
  ) {}

  @Post('register')
  @ApiBody({ type: UserDTO })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async register(@Body() payload: UserDTO): Promise<IJsonResponse<UserModel>> {
    try {
      const respone = await this.userService.register(payload)
      return JsonResponse.success(respone, MESSAGES_CODE.CREATED_SUCCESS)
    } catch (error) {
      this.loggerService.error(ACCOUNT_SERVICE.users.controllerName, this.register.name, error)
      return JsonResponse.error(error.message, null, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('login')
  @ApiBody({ type: LoginUserDTO })
  @ApiResponse({ status: 200, description: 'Login success' })
  async login(@Body() payload: LoginUserDTO, @Res({ passthrough: true }) res: Response): Promise<IJsonResponse<any>> {
    try {
      const serviceResponse = await this.userService.login(payload)

      if (serviceResponse && serviceResponse.accessToken) {
        const expireTimeInMs = serviceResponse.expire * 1000

        res.cookie('access_token', serviceResponse.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',

          expires: new Date(Date.now() + expireTimeInMs),

          sameSite: 'lax'
        })

        const clientResponse = {
          phone: serviceResponse.phone,
          accountInfo: serviceResponse.accountInfo
        }

        return JsonResponse.success(clientResponse, MESSAGES_CODE.LOGIN_SUCCESS)
      } else {
        return JsonResponse.error(MESSAGES_CODE.LOGIN_FAIL, null, HttpStatus.UNAUTHORIZED)
      }
    } catch (error) {
      this.loggerService.error(ACCOUNT_SERVICE.users.controllerName, this.login.name, error)
      return JsonResponse.error(error.message, null, HttpStatus.UNAUTHORIZED)
    }
  }

  @Get('profile')
  async getProfile(@Req() req: Request): Promise<IJsonResponse<UserModel>> {
    try {
      const token = req.cookies['access_token']
      if (!token) {
        throw new BadRequestException('Access token cookie is missing')
      }

      let payload: any
      try {
        payload = await this.authService.validateToken(token)
      } catch (e) {
        throw new BadRequestException('Invalid or expired token')
      }

      if (!payload || !payload.phone) {
        throw new BadRequestException('Invalid token payload')
      }

      const user: UserModel = await this.userService.findByField({
        phone: payload.phone
      })

      return JsonResponse.success(user, MESSAGES_CODE.GET_SUCCESS)
    } catch (error) {
      this.loggerService.error('UserController', this.getProfile.name, error)
      return JsonResponse.error(error.message, null, HttpStatus.UNAUTHORIZED)
    }
  }

  // @Get()
  async findByField(@Body() payload: IParams): Promise<IJsonResponse<UserModel>> {
    try {
      if (!Object.keys(payload).length) {
        return JsonResponse.error(MESSAGES_CODE.GET_FAIL, null, HttpStatus.BAD_REQUEST)
      }

      const conditions = {
        ...payload
      }

      const respone: UserModel = await this.userService.findByField(conditions)

      if (respone) {
        return JsonResponse.success(respone, MESSAGES_CODE.GET_SUCCESS)
      } else {
        return JsonResponse.error(MESSAGES_CODE.GET_FAIL, null, HttpStatus.NOT_FOUND)
      }
    } catch (error) {
      this.loggerService.error(ACCOUNT_SERVICE.users.controllerName, this.findByField.name, error)
      return JsonResponse.error(error.message, null, HttpStatus.BAD_REQUEST)
    }
  }
}
