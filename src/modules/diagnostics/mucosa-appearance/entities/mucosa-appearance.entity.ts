import { ApiProperty } from '@nestjs/swagger';
import { MucosaAppearance } from '@prisma/client';
import { MucosaType } from 'src/shared/enums';
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
  name_ru: string;

  @ApiProperty({
    description: 'Name in Uzbek',
    example: 'Oqargan',
  })
  @Expose()
  name_uz: string;

  @ApiProperty({
    description: 'Mucosa Type',
    enum: MucosaType,
  })
  @Expose()
  mucosaType: MucosaType;

  @ApiProperty({
    description: 'Animal Type ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  animalTypeId: string;
}
