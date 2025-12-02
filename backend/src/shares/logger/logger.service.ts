import { Global, Injectable, Logger } from '@nestjs/common'
import * as winston from 'winston'
import { ConfigService } from '../config/configService.service'

@Global()
@Injectable()
export class LoggerService extends Logger {
  private readonly logger: winston.Logger

  constructor(configService: ConfigService) {
    super(LoggerService.name, { timestamp: true })
    this.logger = winston.createLogger(configService.winstonConfig())
    if (configService.nodeEnv !== 'production') {
      this.logger.debug('Logging initialized at debug level')
    }
  }

  text(service: string, functionName: string, text: string): void {
    this.logger.info(`${service}::${functionName}: ${text}`)
  }
  info(service: string, functionName: string, payload: any): void {
    this.logger.info(`${service}::${functionName}`, payload)
  }
  error(service: string, functionName: string, error: any): void {
    this.logger.error(`${service}::${functionName}`, error)
  }
  exception(info: string, error: string): void {
    this.logger.error(`ExceptionFilter::${info} ${error}`)
  }
  logRequest(info: string, userContext: string, payload: string): void {
    this.logger.info(`Request::${info} userContext::${userContext} ${payload}`)
  }
}
