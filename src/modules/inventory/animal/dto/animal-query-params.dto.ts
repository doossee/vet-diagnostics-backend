import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsEnum } from 'class-validator';
import { BaseQueryParamsDto } from 'src/shared/dto';
import { AnimalSex } from '@prisma/client';

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
  @IsEnum(AnimalSex)
  @ApiPropertyOptional({ enum: AnimalSex })
  readonly sex?: AnimalSex;
}
