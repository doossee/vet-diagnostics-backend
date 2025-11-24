import { ApiProperty } from '@nestjs/swagger';
import { UrineClarity } from '@prisma/client';
import { Expose } from 'class-transformer';

export class UrineClarityEntity implements UrineClarity {
  @ApiProperty({
    description: 'Unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Name in Russian',
    example: 'Прозрачная',
  })
  @Expose()
  name_ru: string;

  @ApiProperty({
    description: 'Name in Uzbek',
    example: 'Tiniq',
  })
  @Expose()
  name_uz: string;

  @ApiProperty({
    description: 'Animal Type ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  animalTypeId: string;
}
