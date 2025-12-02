import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsString, IsNotEmpty, IsNumber, Min, IsDateString, IsOptional, IsArray, ValidateNested } from 'class-validator'
import { PlayerLegsDTO } from 'src/modules/player/dto/player.dto'

export class CreateFundDTO {
  @ApiProperty({ example: 'Dây Hụi Tháng 11/2025' }) // 2. Thêm ví dụ
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: 500000 }) // A: Tiền hụi 1 chân
  @IsNumber()
  @Min(1)
  amount: number // A

  @ApiProperty({ example: 100000 }) // B/E: Tiền thảo hoặc tiền bỏ ra
  @IsNumber()
  @Min(0)
  fee: number // B/E: tiền bỏ ra để hốt / tiền thảo

  @ApiProperty({ example: 12 })
  @IsNumber()
  @Min(1)
  totalCycles: number // Tổng số kỳ (thay thế totalMembers)

  @ApiProperty({ example: '2025-11-01T00:00:00.000Z' })
  @IsDateString()
  startDate: string

  @ApiProperty({ example: '2026-10-31T00:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string
}

export class UpdateFundDTO {
  @ApiProperty({ example: '60c72b2f9b1d8c001f8e4a9e' }) // Thêm ví dụ ID
  @IsString()
  @IsNotEmpty()
  fundId: string

  @ApiProperty({ example: 'Dây Hụi Đã Đổi Tên', required: false })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({ example: 1000000, required: false })
  @IsOptional()
  @IsNumber()
  amount?: number

  @ApiProperty({ example: 50000, required: false })
  @IsOptional()
  @IsNumber()
  fee?: number

  @ApiProperty({ example: 12, required: false })
  @IsOptional()
  @IsNumber()
  totalCycles?: number // Cập nhật totalCycles (thay thế totalMembers)
}

// DTO dùng để tạo Fund kèm danh sách thành viên ban đầu
export class CreateFundWithMembersDTO extends CreateFundDTO {
  @ApiProperty({
    example: [
      { playerId: '60c72b2f9b1d8c001f8e4a9e', legs: 1 },
      { playerId: '60c72b2f9b1d8c001f8e4a9f', legs: 2 },
      { playerId: '60c72b2f9b1d8c001f8e4a9a', legs: 9 } // Tổng legs phải = 12
    ],
    type: [PlayerLegsDTO]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlayerLegsDTO)
  players: PlayerLegsDTO[]
}
