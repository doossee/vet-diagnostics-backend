import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { BaseQueryParamsDto } from 'src/shared/dto';

enum AlertSeverityFilter {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

enum AlertStatusFilter {
  NEW = 'NEW',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED',
}

export class AnomalyQueryDto extends BaseQueryParamsDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ description: 'Filter by animal ID' })
  readonly animalId?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ description: 'Filter by session ID' })
  readonly sessionId?: string;

  @IsOptional()
  @IsEnum(AlertSeverityFilter)
  @ApiPropertyOptional({
    description: 'Filter by severity',
    enum: AlertSeverityFilter,
  })
  readonly severity?: AlertSeverityFilter;

  @IsOptional()
  @IsEnum(AlertStatusFilter)
  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: AlertStatusFilter,
  })
  readonly status?: AlertStatusFilter;
}
