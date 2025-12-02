import { prop } from '@typegoose/typegoose'
import { Expose, Transform } from 'class-transformer'
import mongoose, { SchemaOptions } from 'mongoose'

export const FieldsSortDefault = ['createdAt', 'updatedAt']
export const FieldsQueryDefault = ['_id', 'name', 'isDelete']

export abstract class BaseModel {
  /**
   * @field makes sure that when deserializing from a Mongoose Object,
   *  ObjectId is serialized into a string
   */
  @Transform((value) => {
    if ('value' in value) {
      return value.obj[value.key].toString()
    }
    return 'unknown value'
  })
  @Transform(({ obj }) => obj._id?.toString())
  @Expose()
  declare _id: string

  // @prop({ required: false, default: null })
  // @Expose()
  // id?: string

  @prop({ required: false, default: null })
  @Expose()
  createdBy: string

  @prop({ required: false, default: null })
  @Expose()
  updatedBy: string

  @prop({ required: false, default: null })
  @Expose()
  createdAt: Date

  @prop({ required: false, default: null })
  @Expose()
  updatedAt: Date

  @prop({ default: false })
  @Expose()
  isDelete: boolean
}

export const schemaOptions: any = {
  timestamps: false
}

export const ObjectId = mongoose.Types.ObjectId
