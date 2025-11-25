import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateAnimalTypeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the animal type in Russian',
    example: 'Крупный рогатый скот',
  })
  readonly name_ru: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the animal type in Uzbek',
    example: 'Qoramol',
  })
  readonly name_uz: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    description: 'Parent animal type ID (for hierarchical types)',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
  })
  readonly parentId?: string;
}
