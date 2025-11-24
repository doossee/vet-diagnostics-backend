import { ApiProperty } from '@nestjs/swagger';
import { FecesColor } from '@prisma/client';
import { Expose } from 'class-transformer';

export class FecesColorEntity implements FecesColor {
  @ApiProperty({
    description: 'Unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Name in Russian',
    example: 'Коричневый',
  })
  @Expose()
  name_ru: string;

  @ApiProperty({
    description: 'Name in Uzbek',
    example: 'Jigarrang',
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
