import { Module } from '@nestjs/common'
import { FundService } from './services/fund.service'
import { MongooseModule } from '@nestjs/mongoose'
import { FundModel } from './models/fund.model'
import { FundController } from './controllers/fund.controller'
import { LoggerService } from 'src/shares/logger/logger.service'
import { CycleModel } from '../cycle/models/cycle.model'
import { PlayerModel } from '../player/models/player.model'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FundModel.modelName, schema: FundModel.model.schema },
      { name: CycleModel.modelName, schema: CycleModel.model.schema },
      { name: PlayerModel.modelName, schema: PlayerModel.model.schema }
    ])
  ],
  controllers: [FundController],
  providers: [LoggerService, FundService],
  exports: [FundService]
})
export class FundModule {}
