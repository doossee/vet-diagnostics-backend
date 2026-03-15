import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateReferenceRangeDto {
  @ApiProperty({ description: 'Animal type UUID' })
  @IsUUID()
  @IsNotEmpty()
  animalTypeId: string;

  @ApiProperty({
    description: 'Parameter name (e.g. "pulse", "hemoglobin")',
    example: 'pulse',
  })
  @IsString()
  @IsNotEmpty()
  parameter: string;

  @ApiProperty({ description: 'Minimum normal value', example: 60 })
  @IsNumber()
  minValue: number;

  @ApiProperty({ description: 'Maximum normal value', example: 80 })
  @IsNumber()
  maxValue: number;

  @ApiPropertyOptional({
    description: 'Unit of measurement',
    example: 'beats/min',
  })
  @IsString()
  @IsOptional()
  unit?: string;
}
