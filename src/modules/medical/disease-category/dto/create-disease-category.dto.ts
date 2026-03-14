import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateDiseaseCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name in Russian',
    example: 'Болезни пищеварительной системы',
  })
  readonly nameRu: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name in Uzbek',
    example: 'Hazm qilish tizimi kasalliklari',
  })
  readonly nameUz: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    description: 'Parent category ID (for hierarchical structure)',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
  })
  readonly parentId?: string;
}
