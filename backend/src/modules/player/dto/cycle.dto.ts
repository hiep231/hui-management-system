import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator'

export class ClaimCycleDTO {
  @IsString()
  @IsNotEmpty()
  playerId: string

  @IsString()
  @IsNotEmpty()
  fundId: string

  @IsString()
  @IsNotEmpty()
  cycleId: string

  @IsNumber()
  @Min(1)
  legsClaimed: number

  @IsNumber()
  @Min(0)
  paidAmount: number // số tiền người hốt bỏ ra (B)
}
