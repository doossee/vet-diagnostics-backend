import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MucosaType } from 'src/shared/enums';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export class CreateMucosaExamDto {
  @ApiProperty({ enum: MucosaType })
  @IsEnum(MucosaType)
  mucosaType: MucosaType;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsOptional()
  animalId?: string;

  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsOptional()
  mucosaAppearanceId?: string;
}
