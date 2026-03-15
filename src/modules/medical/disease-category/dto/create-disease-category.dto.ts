import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { NameDto } from 'src/shared/dto';

export class CreateDiseaseCategoryDto {
  @ValidateNested()
  @Type(() => NameDto)
  @ApiProperty({ type: NameDto, description: 'Localized name' })
  readonly name: NameDto;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    description: 'Parent category ID (for hierarchical structure)',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
  })
  readonly parentId?: string;
}
