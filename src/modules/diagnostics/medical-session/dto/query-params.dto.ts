import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsUUID } from 'class-validator';
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

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @ApiPropertyOptional({
    description: 'Filter sessions that have a clinical exam attached',
  })
  readonly hasClinicalExam?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @ApiPropertyOptional({
    description: 'Filter sessions that have a blood exam attached',
  })
  readonly hasBloodExam?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @ApiPropertyOptional({
    description: 'Filter sessions that have a urine exam attached',
  })
  readonly hasUrineExam?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @ApiPropertyOptional({
    description: 'Filter sessions that have a feces exam attached',
  })
  readonly hasFecesExam?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @ApiPropertyOptional({
    description: 'Filter sessions that have at least one mucosa exam attached',
  })
  readonly hasMucosaExam?: boolean;
}
