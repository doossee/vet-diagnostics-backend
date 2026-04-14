import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NameDto } from 'src/shared/dto';

export class CreateAnimalTypeDto {
  @ValidateNested()
  @Type(() => NameDto)
  @ApiProperty({ type: NameDto, description: 'Localized name' })
  readonly name: NameDto;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    description: 'Parent animal type ID (for hierarchical types)',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
  })
  readonly parentId?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description:
      'AI model key used to route predictions for this type (e.g. "buqa", "sigir")',
    example: 'buqa',
  })
  readonly modelKey?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    description:
      'Optional sex constraint — only animals of this sex match this type',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
  })
  readonly sexId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiPropertyOptional({
    description: 'Minimum age in total months for this type (inclusive)',
    example: 36,
  })
  readonly minAgeMonths?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiPropertyOptional({
    description:
      'Maximum age in total months for this type (inclusive, null = no upper bound)',
    example: 35,
  })
  readonly maxAgeMonths?: number;
}
