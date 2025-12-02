import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { UserContext } from 'src/shares/controllers/payload.interface'

export class UserDTO {
  @ApiProperty({ example: '0862204453' })
  @IsString()
  @IsNotEmpty()
  phone: string

  @ApiProperty({ example: 'hiep@gmail.com' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({ example: 'Hiep' })
  @IsString()
  @IsNotEmpty()
  userName: string

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  password: string
}

export class UserUpdateDTO extends UserContext {
  @ApiProperty({ example: '0862204453' }) // Thêm ví dụ
  @IsString()
  @IsNotEmpty()
  phone: string

  @ApiProperty({ example: 'hiep@gmail.com' }) // Thêm ví dụ
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({ example: 'Hiep' }) // Thêm ví dụ
  @IsString()
  @IsNotEmpty()
  userName: string
}

export class UpdatePasswordDTO extends UserContext {
  @ApiProperty({ example: 'new_password123' }) // Thêm ví dụ
  @IsString()
  @IsNotEmpty()
  password: string

  @ApiProperty({ example: 'new_password123' }) // Thêm ví dụ
  @IsString()
  @IsNotEmpty()
  passwordConfirm: string

  @ApiProperty({ example: '0862204453' }) // Thêm ví dụ
  @IsString()
  @IsNotEmpty()
  phone: string

  @ApiProperty({ example: 'hiep@gmail.com' }) // Thêm ví dụ
  @IsString()
  @IsEmail()
  email: string
}
