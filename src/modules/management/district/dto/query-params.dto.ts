import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseQueryParamsDto } from 'src/shared/dto';

export class DistrictQueryParamsDto extends BaseQueryParamsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @ApiPropertyOptional({
    description: 'Filter by region ID',
    example: 1,
    type: Number,
  })
  readonly regionId?: number;
}
