import { Module } from '@nestjs/common'
import { CycleService } from './services/cycle.service'
import { MongooseModule } from '@nestjs/mongoose'
import { CycleModel } from './models/cycle.model'
import { TransactionModel } from './models/transaction.model'
import { CycleController } from './controllers/cycle.controller'
import { LoggerService } from 'src/shares/logger/logger.service'
import { FundModel } from '../fund/models/fund.model'
import { PlayerModel } from '../player/models/player.model'
import { FundService } from '../fund/services/fund.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CycleModel.modelName, schema: CycleModel.model.schema },
      { name: TransactionModel.modelName, schema: TransactionModel.model.schema },
      { name: FundModel.modelName, schema: FundModel.model.schema },
      { name: PlayerModel.modelName, schema: PlayerModel.model.schema }
    ])
  ],
  controllers: [CycleController],
  providers: [LoggerService, CycleService, FundService],
  exports: [CycleService]
})
export class CycleModule {}
