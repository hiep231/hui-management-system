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
// Đánh Index để tối ưu Query
@index({ cycle: 1, player: 1 }, { background: true }) // Tìm giao dịch của user trong 1 kỳ
@index({ fund: 1, player: 1 }, { background: true }) // Tìm tất cả giao dịch của user trong 1 dây
@index({ paidAt: 1 }, { background: true }) // Thống kê theo ngày
@index({ status: 1 }, { background: true })
export class TransactionModel extends BaseModel {
  @prop({ ref: () => FundModel, required: true })
  fund!: Ref<FundModel>

  @prop({ ref: () => CycleModel, required: true })
  cycle!: Ref<CycleModel>

  @prop({ required: true })
  cycleNumber!: number // Lưu dư thừa để query nhanh không cần populate Cycle

  @prop({ ref: () => PlayerModel, required: true })
  player!: Ref<PlayerModel>

  @prop({ required: true })
  amountDue!: number // Số tiền phải đóng

  @prop({ required: true, default: 0 })
  amountPaid!: number // Số tiền đã đóng

  @prop({ required: true, default: 'PENDING' })
  status!: 'PAID' | 'PENDING'

  @prop()
  paidAt?: Date

  // Loại giao dịch: Thu tiền hụi (INCOME) hay Trả tiền hốt (EXPENSE) - Mở rộng cho tương lai
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
