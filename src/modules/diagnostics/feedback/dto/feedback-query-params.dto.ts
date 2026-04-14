import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { BaseQueryParamsDto } from 'src/shared/dto';

export class FeedbackQueryParamsDto extends BaseQueryParamsDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  readonly predictionId?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  readonly veterinarianId?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  readonly adminId?: string;
}
