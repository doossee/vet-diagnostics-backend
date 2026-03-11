import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { BaseQueryParamsDto } from 'src/shared/dto';

export class AnimalQueryParamsDto extends BaseQueryParamsDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  readonly farmerId?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  readonly animalTypeId?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ description: 'Filter by sex lookup ID' })
  readonly sexId?: string;
}
