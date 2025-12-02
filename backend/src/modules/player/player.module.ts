import { Module } from '@nestjs/common'
import { PlayerService } from './services/player.service'
import { MongooseModule } from '@nestjs/mongoose'
import { PlayerModel } from './models/player.model'
import { PlayerController } from './controllers/player.controller'
import { LoggerService } from 'src/shares/logger/logger.service'
import { FundService } from '../fund/services/fund.service'
import { FundModel } from '../fund/models/fund.model'
import { CycleModel } from '../cycle/models/cycle.model'
import { CycleService } from '../cycle/services/cycle.service'
import { TransactionModel } from '../cycle/models/transaction.model'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PlayerModel.modelName, schema: PlayerModel.model.schema },
      { name: FundModel.modelName, schema: FundModel.model.schema },
      { name: CycleModel.modelName, schema: CycleModel.model.schema },
      { name: TransactionModel.modelName, schema: TransactionModel.model.schema }
    ])
  ],
  controllers: [PlayerController],
  providers: [LoggerService, PlayerService, FundService, CycleService],
  exports: [PlayerService]
})
export class PlayerModule {}
