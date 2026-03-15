import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class TrendQueryDto {
  @ApiProperty({ description: 'Animal UUID to track trends for' })
  @IsUUID()
  @IsNotEmpty()
  readonly animalId: string;

  @ApiProperty({
    description:
      'Parameter name to track (e.g. "pulse", "hemoglobin", "glucose")',
  })
  @IsString()
  @IsNotEmpty()
  readonly parameter: string;

  @ApiPropertyOptional({ description: 'Start date (ISO 8601)' })
  @IsDateString()
  @IsOptional()
  readonly from?: string;

  @ApiPropertyOptional({ description: 'End date (ISO 8601)' })
  @IsDateString()
  @IsOptional()
  readonly to?: string;

  @ApiPropertyOptional({
    description: 'Max number of data points to return (default 20)',
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  readonly limit?: number;
}
