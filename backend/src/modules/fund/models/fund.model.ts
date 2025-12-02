import { getModelForClass, index, ModelOptions, prop, Ref, Severity } from '@typegoose/typegoose'
import { Exclude } from 'class-transformer'
import { BaseModel, schemaOptions } from 'src/shares/models/base.model'
import { PlayerModel } from 'src/modules/player/models/player.model'
import { CycleModel } from 'src/modules/cycle/models/cycle.model'

// Sub-document để lưu thông tin thành viên (Player) trong từng Dây Hụi (Fund)
export class FundMember {
  @prop({ ref: () => PlayerModel, required: true })
  player!: Ref<PlayerModel>

  @prop({ required: true, default: 1 })
  initialLegs!: number // Tổng số chân đăng ký ban đầu (F + G)

  @prop({ required: true, default: 0 })
  legsClaimed!: number // Tổng số chân đã hốt (F)

  @prop({ type: () => [Number], default: [] })
  claimedCycleNumbers!: number[] // Các kỳ (cycleNumber) đã hốt
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
  name!: string // tên nhóm hụi (tên dây)

  @prop({ required: true })
  amount!: number // A: số tiền của hụi (cho 1 chân)

  @prop({ required: true })
  fee!: number // Tiền Bỏ ra để Hốt (B), hoặc có thể dùng cho tiền thảo (E)

  @prop({ required: true, default: 12 })
  totalCycles!: number // Tổng số kỳ (Thường là 12)

  @prop({ default: 0 })
  totalLegsRegistered!: number // Tổng số chân đã đăng ký (phải = totalCycles)

  @prop({ type: () => [FundMember], default: [] })
  members!: FundMember[] // Danh sách người chơi tham gia dây hụi này

  @prop({ default: true })
  status!: boolean // còn hoạt động hay không

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
