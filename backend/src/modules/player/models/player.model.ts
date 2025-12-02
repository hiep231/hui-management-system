import { getModelForClass, index, ModelOptions, prop, Ref, Severity } from '@typegoose/typegoose'
import { Exclude } from 'class-transformer'
import { BaseModel, schemaOptions } from 'src/shares/models/base.model'

@Exclude()
@ModelOptions({
  options: {
    allowMixed: Severity.ALLOW
  }
})
@index({ userName: 'text', phone: 'text' })
export class PlayerModel extends BaseModel {
  @prop({ required: true })
  userName!: string

  static get model() {
    return getModelForClass(PlayerModel, {
      schemaOptions: { ...schemaOptions, collection: 'player' }
    })
  }

  static get modelName(): string {
    return this.model.modelName
  }

  static createModel(payload: Partial<PlayerModel>) {
    return new this.model(payload)
  }
}
