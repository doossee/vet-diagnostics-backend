import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { BaseQueryParamsDto } from 'src/shared/dto';

export class VetStationQueryParamsDto extends BaseQueryParamsDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    description: 'Filter by district ID',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
    type: String,
  })
  readonly districtId?: string;
}
