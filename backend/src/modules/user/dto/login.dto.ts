import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class LoginUserDTO {
  @ApiProperty({ example: '0862204453' })
  @IsString()
  @IsNotEmpty()
  phone: string

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  password: string
}

export class LoginUserResponseDTO {
  @IsString()
  @IsNotEmpty()
  phone: string

  accessToken: string

  expire: number

  accountInfo: any
}
