import { getModelForClass, index, ModelOptions, prop, Ref, Severity } from '@typegoose/typegoose'
import { Exclude } from 'class-transformer'
import { BaseModel, schemaOptions } from 'src/shares/models/base.model'
import { PlayerModel } from 'src/modules/player/models/player.model'
import { CycleModel } from 'src/modules/cycle/models/cycle.model'

export class FundMember {
  @prop({ ref: () => PlayerModel, required: true })
  player!: Ref<PlayerModel>

  @prop({ required: true, default: 1 })
  initialLegs!: number

  @prop({ required: true, default: 0 })
  legsClaimed!: number

  @prop({ type: () => [Number], default: [] })
  claimedCycleNumbers!: number[]
}

@Exclude()
@ModelOptions({
  options: {
    allowMixed: Severity.ALLOW
  }
})
@index({ isDelete: 1, createdAt: -1 })
@index({ name: 'text' })
export class FundModel extends BaseModel {
  @prop({ required: true, trim: true })
  name!: string

  @prop({ required: true })
  amount!: number

  @prop({ required: true })
  fee!: number

  @prop({ required: true, default: 12 })
  totalCycles!: number

  @prop({ default: 0 })
  totalLegsRegistered!: number

  @prop({ type: () => [FundMember], default: [] })
  members!: FundMember[]

  @prop({ default: true })
  status!: boolean

  @prop({ required: true })
  startDate!: Date

  @prop()
  endDate?: Date

  static get model() {
    return getModelForClass(FundModel, {
      schemaOptions: { ...schemaOptions, collection: 'fund' }
    })
  }

  static get modelName(): string {
    return this.model.modelName
  }

  static createModel(payload: Partial<FundModel>) {
    return new this.model(payload)
  }
}
