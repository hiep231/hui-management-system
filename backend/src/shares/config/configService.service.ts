import * as dotenv from 'dotenv'
import * as winston from 'winston'
import * as DailyRotateFile from 'winston-daily-rotate-file'

export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null

  constructor() {
    // Check env
    dotenv.config({
      // path: `.env.local`
      path: `.env`
    })

    console.log('NODE_ENV::', process.env.NODE_ENV)
    this.envConfig = { ...process.env }
    this.envConfig.port = 8000
  }

  public get(key: string): any {
    return this.envConfig[key]
  }

  public getKeyString(key: string): string {
    return process.env[key]
  }

  public getNumber(key: string): number {
    return Number(this.getKeyString(key))
  }

  get nodeEnv(): string {
    return this.getKeyString('NODE_ENV') || 'development'
  }

  public winstonConfig(): winston.LoggerOptions {
    return {
      transports: [
        new DailyRotateFile({
          level: 'debug',
          filename: `./logs/${this.nodeEnv}_log/debug-%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: winston.format.combine(winston.format.timestamp(), winston.format.json())
        }),
        new DailyRotateFile({
          level: 'error',
          filename: `./logs/${this.nodeEnv}_log/error-%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxSize: '20m',
          maxFiles: '30d',
          format: winston.format.combine(winston.format.timestamp(), winston.format.json())
        }),
        new winston.transports.Console({
          level: 'debug',
          handleExceptions: true,
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({
              format: 'DD-MM-YYYY HH:mm:ss'
            }),
            winston.format.simple()
          )
        })
      ],
      exitOnError: false
    }
  }
}
