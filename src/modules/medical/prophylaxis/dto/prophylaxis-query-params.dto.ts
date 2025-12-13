import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { BaseQueryParamsDto } from 'src/shared/dto';
import { ProphylaxisType } from 'src/shared/enums';

export class ProphylaxisQueryParamsDto extends BaseQueryParamsDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  readonly animalId?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  readonly itemId?: string;

  @IsEnum(ProphylaxisType)
  @IsOptional()
  @ApiPropertyOptional()
  readonly type?: ProphylaxisType;
}
