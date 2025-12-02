import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator'
import { Number } from 'mongoose'

export class CreatePlayerDTO {
  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  @IsNotEmpty()
  userName: string
}

export class JoinFundDTO {
  @ApiProperty({ example: '60c72b2f9b1d8c001f8e4a9e' })
  @IsString()
  @IsNotEmpty()
  playerId: string

  @ApiProperty({ example: '60c72b2f9b1d8c001f8e4a9f' })
  @IsString()
  @IsNotEmpty()
  fundId: string

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  legs: Number
}

export class PlayerLegsDTO {
  @ApiProperty({ example: '60c72b2f9b1d8c001f8e4a9e' })
  @IsString()
  @IsNotEmpty()
  playerId: string

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  legs: number
}

export class UpdatePlayerDTO {
  @ApiProperty({ example: 'Nguyễn Văn A Mới', required: false })
  @IsString()
  @IsOptional()
  userName?: string
}
