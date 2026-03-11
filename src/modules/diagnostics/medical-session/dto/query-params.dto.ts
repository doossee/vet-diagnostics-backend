import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { BaseQueryParamsDto } from 'src/shared/dto';

enum SessionStatusFilter {
  DRAFT = 'DRAFT',
  READY = 'READY',
  SUBMITTED = 'SUBMITTED',
}

export class MedicalSessionQueryParamsDto extends BaseQueryParamsDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ description: 'Filter by animal ID' })
  readonly animalId?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ description: 'Filter by veterinarian ID' })
  readonly veterinarianId?: string;

  @IsOptional()
  @IsEnum(SessionStatusFilter)
  @ApiPropertyOptional({
    description: 'Filter by session status',
    enum: SessionStatusFilter,
  })
  readonly status?: SessionStatusFilter;
}
