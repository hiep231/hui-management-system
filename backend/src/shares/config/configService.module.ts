import { Module, Global } from '@nestjs/common'
import { ConfigService } from './configService.service'

@Global()
@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService()
    }
  ],
  exports: [ConfigService]
})
export class ConfigServiceModule {}
