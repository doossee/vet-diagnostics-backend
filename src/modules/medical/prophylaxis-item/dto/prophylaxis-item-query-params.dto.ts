import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { BaseQueryParamsDto } from 'src/shared/dto';
import { ProphylaxisType } from '@prisma/client';

export class ProphylaxisItemQueryParamsDto extends BaseQueryParamsDto {
  @IsOptional()
  @IsEnum(ProphylaxisType)
  @ApiPropertyOptional({ enum: ProphylaxisType })
  readonly type?: ProphylaxisType;
}
