import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { BaseQueryParamsDto } from 'src/shared/dto';

export class ProphylaxisQueryParamsDto extends BaseQueryParamsDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  readonly animalId?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  readonly itemId?: string;
}
