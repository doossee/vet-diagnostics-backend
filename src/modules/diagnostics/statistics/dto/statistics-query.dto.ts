import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class StatisticsQueryDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ description: 'Filter by animal type ID' })
  readonly animalTypeId?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Start date filter (ISO 8601)',
    example: '2026-01-01',
  })
  readonly startDate?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'End date filter (ISO 8601)',
    example: '2026-12-31',
  })
  readonly endDate?: string;
}
