import { IsOptional, IsString, IsUUID, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SortOrder } from 'src/shared/dto';
import { MucosaType } from '@prisma/client';

export class MucosaAppearanceQueryParamsDto {
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({ description: 'Page number', example: 1, default: 1 })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Items per page',
    example: 10,
    default: 10,
  })
  perPage?: number = 10;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Search by name (Russian or Uzbek)',
    example: 'Бледный',
  })
  search?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    description: 'Filter by animal type ID',
    format: 'uuid',
  })
  animalTypeId?: string;

  @IsOptional()
  @IsEnum(MucosaType)
  @ApiPropertyOptional({
    enum: MucosaType,
    description: 'Filter by mucosa type',
  })
  mucosaType?: MucosaType;

  @IsOptional()
  @IsEnum(SortOrder)
  @ApiPropertyOptional({
    enum: SortOrder,
    description: 'Sort order by ID',
    example: 'asc',
  })
  byId?: SortOrder;
}
