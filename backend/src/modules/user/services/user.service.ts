import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { UserModel } from '../models/user.model'
import { UserDTO } from '../dto/user.dto'
import { LoggerService } from 'src/shares/logger/logger.service'
import { BaseService } from 'src/shares/services/mongo/base.service'
import { AuthService } from 'src/shares/services/auth/services/auth.service'
import * as bcrypt from 'bcrypt'
import { ACCOUNT_SERVICE } from 'src/shares/constants/services.constant'
import { MESSAGES_CODE } from 'src/shares/constants/status.constants'
import { LoginUserDTO, LoginUserResponseDTO } from '../dto/login.dto'
import { ObjectId } from 'src/shares/models/base.model'
import { ModelType } from '@typegoose/typegoose/lib/types'

interface IUserService {
  register(dto: UserDTO): Promise<UserModel>
  // logout(conditions: FilterQuery<UserModel>): Promise<boolean>;
  login(dto: LoginUserDTO, isHashPassword: boolean): Promise<LoginUserResponseDTO>

  findByField(conditions: FilterQuery<UserModel>): Promise<UserModel>
  findByPhone(phone: string): Promise<UserModel>
  init(): Promise<void>
}

@Injectable()
export class UserService extends BaseService<UserModel> implements IUserService {
  constructor(
    @InjectModel('User') userModel: ModelType<UserModel>,
    private readonly loggerService: LoggerService,
    private readonly authService: AuthService
  ) {
    super(userModel)
    // this.init()
  }

  async register(dto: UserDTO): Promise<UserModel> {
    this.loggerService.info(ACCOUNT_SERVICE.users.serviceName, this.register.name, dto)

    const existsPhone: UserModel = await this.get({ phone: dto.phone })
    if (existsPhone) {
      throw new Error('Phone already exists')
    }
    const existsEmail: UserModel = await this.get({ email: dto.email })
    if (existsEmail) {
      throw new Error('Email already exists')
    }

    // create token
    const auth = await this.authService.createToken({
      phone: dto.phone,
      email: dto.email
    })

    // hash password
    dto.password = await bcrypt.hash(dto.password, 10)

    dto['createdBy'] = dto?.phone || dto?.email || null
    dto['createdAt'] = new Date()
    dto['isUser'] = true

    const payloadModel = { ...dto }
    console.log('payloadModel:', payloadModel)
    const created: UserModel = await this.save(payloadModel)

    return created
  }

  async login(dto: LoginUserDTO, isHashPassword: boolean = true): Promise<LoginUserResponseDTO> {
    this.loggerService.info(ACCOUNT_SERVICE.users.serviceName, this.login.name, dto)

    const exists: UserModel = await this._model.findOne({ phone: dto.phone })
    if (!exists || exists.phone !== dto.phone) {
      throw new Error('Invalid token') // Lỗi này nên là 'Invalid credentials' hoặc 'User not found'
    }

    // hash & check password
    let checkPassword = dto.password == exists.password
    if (isHashPassword) {
      checkPassword = bcrypt.compareSync(dto.password, exists.password)
    }
    if (!checkPassword) {
      throw new Error('Invalid credentials')
    }

    const auth = await this.authService.createToken({ phone: dto.phone, email: exists.email })

    // update info - ***ĐÃ THAY ĐỔI: KHÔNG LƯU TOKEN VÀO DB***
    const updated: UserModel = await this.updateOne(
      { _id: new ObjectId(exists._id) },
      { recentAt: new Date() } // Chỉ cập nhật 'recentAt'
    )

    if (auth) {
      return {
        phone: dto.phone,
        accessToken: auth.accessToken, // Service vẫn trả token để Controller set cookie
        expire: auth.expire,
        accountInfo: updated || exists // Trả về thông tin user
      }
    }

    return {
      phone: dto.phone,
      accessToken: null,
      expire: 0,
      accountInfo: null
    }
  }

  async findByField(conditions: FilterQuery<UserModel>): Promise<UserModel | any> {
    this.loggerService.info(ACCOUNT_SERVICE.users.serviceName, this.findByField.name, conditions)
    return this.get(conditions)
  }

  findByPhone(phone: string) {
    return this.get({ phone: phone })
  }

  async init() {
    let dto: UserDTO = {
      phone: '0862204453',
      email: 'fundSupperUser@gmail.com',
      userName: 'Supper Shop Owner',
      password: '123456'
    } as UserDTO

    const exists: UserModel = await this.get({ phone: dto.phone })
    if (exists) {
      return
    }

    // create token
    const auth = await this.authService.createToken({ phone: dto.phone, email: dto.email })

    // hash password
    dto.password = await bcrypt.hash(dto.password, 10)

    const payloadModel = { ...dto, token: auth.accessToken, recentAt: new Date() }
    const created = await this.save(payloadModel)
    if (created) {
      this.loggerService.info(ACCOUNT_SERVICE.users.serviceName, this.init.name, MESSAGES_CODE.CREATED_SUCCESS)
      return
    }
    this.loggerService.info(ACCOUNT_SERVICE.users.serviceName, this.init.name, MESSAGES_CODE.COUNT_FAIL)
  }
}
