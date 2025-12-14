import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsUUID, ValidateIf } from 'class-validator';
import { BaseQueryParamsDto } from 'src/shared/dto';

export class AnimalTypeQueryParamsDto extends BaseQueryParamsDto {
  @IsOptional()
  @Transform(({ value }) => (value === 'null' ? null : value) as string | null)
  @ValidateIf((_, value) => value !== null)
  @IsUUID()
  @ApiPropertyOptional({
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
    nullable: true,
  })
  readonly parentId?: string | null;
}
