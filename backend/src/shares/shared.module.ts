import { Global, Module } from '@nestjs/common';
import { ConfigServiceModule } from './config/configService.module';
import { ConfigService } from './config/configService.service';
import { LoggerModule } from './logger/logger.module';
import { LoggerService } from './logger/logger.service';
// CI test
@Global()
@Module({
	imports: [
		ConfigServiceModule,
		LoggerModule
	],
	providers: [
		LoggerService,
		ConfigService
	],
	controllers: [],
	exports: [
		LoggerService,
		ConfigService
	],
})
export class SharedModule { }
