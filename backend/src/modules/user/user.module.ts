import { Module } from '@nestjs/common'
import { UserService } from './services/user.service'
import { MongooseModule } from '@nestjs/mongoose'
import { UserModel } from './models/user.model'
import { UserController } from './controllers/user.controller'
import { LoggerService } from 'src/shares/logger/logger.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserModel.model.schema }])],
  controllers: [UserController],
  providers: [LoggerService, UserService],
  exports: [UserService]
})
export class UserModule {}
