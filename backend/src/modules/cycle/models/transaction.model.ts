import { getModelForClass, ModelOptions, prop, Ref, Severity, index } from '@typegoose/typegoose'
import { Exclude } from 'class-transformer'
import { BaseModel, schemaOptions } from 'src/shares/models/base.model'
import { FundModel } from 'src/modules/fund/models/fund.model'
import { PlayerModel } from 'src/modules/player/models/player.model'
import { CycleModel } from './cycle.model'

@Exclude()
@ModelOptions({
  options: {
    allowMixed: Severity.ALLOW
  }
})
@index({ cycle: 1, player: 1 }, { background: true })
@index({ fund: 1, player: 1 }, { background: true })
@index({ paidAt: 1 }, { background: true })
@index({ status: 1 }, { background: true })
export class TransactionModel extends BaseModel {
  @prop({ ref: () => FundModel, required: true })
  fund!: Ref<FundModel>

  @prop({ ref: () => CycleModel, required: true })
  cycle!: Ref<CycleModel>

  @prop({ required: true })
  cycleNumber!: number

  @prop({ ref: () => PlayerModel, required: true })
  player!: Ref<PlayerModel>

  @prop({ required: true })
  amountDue!: number

  @prop({ required: true, default: 0 })
  amountPaid!: number

  @prop({ required: true, default: 'PENDING' })
  status!: 'PAID' | 'PENDING'

  @prop()
  paidAt?: Date

  @prop({ default: 'COLLECTION' })
  type!: 'COLLECTION' | 'PAYOUT'

  static get model() {
    return getModelForClass(TransactionModel, {
      schemaOptions: { ...schemaOptions, collection: 'transactions' }
    })
  }

  static get modelName(): string {
    return this.model.modelName
  }

  static createModel(payload: Partial<TransactionModel>) {
    return new this.model(payload)
  }
}
