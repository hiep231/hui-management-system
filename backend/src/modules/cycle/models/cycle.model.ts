import { getModelForClass, index, ModelOptions, prop, Ref, Severity } from '@typegoose/typegoose'
import { BaseModel, schemaOptions } from 'src/shares/models/base.model'
import { FundModel } from 'src/modules/fund/models/fund.model'
import { PlayerModel } from 'src/modules/player/models/player.model'
import { Exclude } from 'class-transformer'

export class PaymentDetail {
  @prop({ ref: () => PlayerModel, required: true })
  player!: Ref<PlayerModel>

  @prop({ required: true })
  amountDue!: number

  @prop({ default: false })
  isPaid!: boolean
}

export class ClaimerDetail {
  @prop({ ref: () => PlayerModel, required: true })
  player!: Ref<PlayerModel>

  @prop({ required: true })
  legsClaimed!: number

  @prop({ required: true })
  paidAmount!: number

  @prop({ required: true })
  amountReceived!: number

  @prop({ default: Date.now })
  claimedAt!: Date
}

@Exclude()
@ModelOptions({ options: { allowMixed: Severity.ALLOW } })
@index({ fund: 1, cycleNumber: 1 }, { background: true })
@index({ 'claimers.claimedAt': 1 }, { background: true })
export class CycleModel extends BaseModel {
  @prop({ ref: () => FundModel, required: true })
  fund!: Ref<FundModel>

  @prop({ required: true })
  cycleNumber!: number

  @prop({ required: true })
  payoutDate!: Date

  @prop({ default: false })
  closed!: boolean

  @prop({ type: () => [ClaimerDetail], default: [] })
  claimers!: ClaimerDetail[]

  @prop({ type: () => [PaymentDetail], default: [] })
  payments!: PaymentDetail[]

  static get model() {
    return getModelForClass(CycleModel, {
      schemaOptions: { ...schemaOptions, collection: 'cycle' }
    })
  }

  static get modelName(): string {
    return this.model.modelName
  }

  static createModel(payload: Partial<CycleModel>) {
    return new this.model(payload)
  }
}
