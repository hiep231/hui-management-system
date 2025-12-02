import { IsNotEmpty, IsString } from 'class-validator'
import { UserContext } from '../payload.interface'
export class UserAppDTO extends UserContext {
  @IsString()
  @IsNotEmpty()
  userId: string
}
