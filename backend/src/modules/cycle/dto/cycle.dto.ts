import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator'

export class CreateCycleDTO {
  @ApiProperty({ example: '60c72b2f9b1d8c001f8e4a9e' })
  @IsString()
  @IsNotEmpty()
  fundId: string

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  cycleNumber: number

  @ApiProperty({ example: '2025-11-01T00:00:00.000Z' })
  @IsString()
  @IsNotEmpty()
  payoutDate: string
}

export class UpdateCycleDTO {
  @ApiProperty({ example: '60c72b2f9b1d8c001f8e4a9f' })
  @IsString()
  @IsNotEmpty()
  cycleId: string

  @ApiProperty({ example: '2025-11-01T00:00:00.000Z', required: false })
  @IsOptional()
  @IsString()
  payoutDate?: string

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  closed?: boolean
}

export class ClaimCycleDTO {
  @ApiProperty({ example: '60c72b2f9b1d8c001f8e4a9e' })
  @IsString()
  @IsNotEmpty()
  playerId: string

  @ApiProperty({ example: '60c72b2f9b1d8c001f8e4a9f' })
  @IsString()
  @IsNotEmpty()
  fundId: string

  @ApiProperty({ example: '60c72b2f9b1d8c001f8e4a9a' })
  @IsString()
  @IsNotEmpty()
  cycleId: string

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  legsClaimed: number

  @ApiProperty({ example: 100000 })
  @IsNumber()
  @Min(0)
  paidAmount: number
}
