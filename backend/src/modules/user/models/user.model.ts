import { getModelForClass, ModelOptions, prop, Ref, Severity } from '@typegoose/typegoose'
import { Exclude } from 'class-transformer'
import { BaseModel, schemaOptions } from 'src/shares/models/base.model'

@Exclude()
@ModelOptions({
  options: {
    allowMixed: Severity.ALLOW
  }
})
export class UserModel extends BaseModel {
  @prop({ required: true, default: null })
  userName: string

  @prop({ required: true, default: null })
  email: string

  @prop({ required: false, default: null })
  password: string

  @prop({ required: true, default: null })
  phone: string

  static get model() {
    return getModelForClass(UserModel, {
      schemaOptions: { ...schemaOptions, collection: 'user' }
    })
  }

  static get modelName(): string {
    return this.model.modelName
  }

  static createModel(payload: UserModel) {
    const result = new this.model(payload)
    return result
  }
}
