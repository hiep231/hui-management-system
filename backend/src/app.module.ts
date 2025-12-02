import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MongooseModule } from '@nestjs/mongoose'
import { CycleModule } from './modules/cycle/cycle.module'
import { FundModule } from './modules/fund/fund.module'
import { PlayerModule } from './modules/player/player.module'
import { UserModule } from './modules/user/user.module'
import { AuthModule } from './shares/services/auth/auth.module'
import { SharedModule } from './shares/shared.module'
import { ConfigService } from './shares/config/configService.service'

@Module({
  imports: [
    SharedModule,

    MongooseModule.forRootAsync({
      imports: [SharedModule],
      useFactory: async (configService: ConfigService) => {
        const user = configService.get('MONGODB_USER')
        const pass = configService.get('MONGODB_PASSWORD')
        const host = configService.get('MONGODB_HOST')
        const dbName = configService.get('MONGODB_NAME')

        const uri = `mongodb+srv://${user}:${pass}@${host}/${dbName}`

        return {
          uri
        }
      },
      inject: [ConfigService]
    }),

    CycleModule,
    FundModule,
    PlayerModule,
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
