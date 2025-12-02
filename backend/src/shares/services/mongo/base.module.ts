import { Global, Module } from '@nestjs/common'
import { BaseService } from './base.service'
import { LoggerService } from 'src/shares/logger/logger.service'

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [BaseService, LoggerService],
  exports: [BaseService]
})
export class BaseModule {}
