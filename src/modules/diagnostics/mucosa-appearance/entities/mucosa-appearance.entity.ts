import { ApiProperty } from '@nestjs/swagger';
import { MucosaAppearance } from '@prisma/client';
import { Expose } from 'class-transformer';

export class MucosaAppearanceEntity implements MucosaAppearance {
  @ApiProperty({
    description: 'Unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Name in Russian',
    example: 'Бледная',
  })
  @Expose()
  nameRu: string;

  @ApiProperty({
    description: 'Name in Uzbek',
    example: 'Oqargan',
  })
  @Expose()
  nameUz: string;

  @ApiProperty({
    description: 'Numeric value for ML mapping',
    example: 1,
  })
  @Expose()
  numericValue: number;

  @ApiProperty({
    description: 'Mucosa Type ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @Expose()
  mucosaTypeId: string | null;

  @ApiProperty({
    description: 'Animal Type ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  animalTypeId: string;
}
