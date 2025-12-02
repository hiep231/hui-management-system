import { Global, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './services/auth.service'
import { JwtStrategy } from './services/jwt.strategy'
import { ConfigServiceModule } from 'src/shares/config/configService.module'
import { UserModule } from 'src/modules/user/user.module'
import { ConfigService } from 'src/shares/config/configService.service'
import { LoggerService } from 'src/shares/logger/logger.service'

@Global()
@Module({
  imports: [
    ConfigServiceModule,
    UserModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: true
    }),
    JwtModule.registerAsync({
      imports: [ConfigServiceModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('SECRETKEY'),
        signOptions: {
          expiresIn: parseInt(configService.get('EXPIRESIN'))
        }
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [],
  providers: [AuthService, LoggerService, JwtStrategy],
  exports: [AuthService, PassportModule]
})
export class AuthModule {}
