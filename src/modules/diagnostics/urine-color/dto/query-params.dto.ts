import { IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseQueryParamsDto } from 'src/shared/dto';

export class UrineColorQueryParamsDto extends BaseQueryParamsDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    description: 'Filter by animal type ID',
    format: 'uuid',
  })
  readonly animalTypeId?: string;
}
