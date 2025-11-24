import { ApiProperty } from '@nestjs/swagger';
import { Color } from '@prisma/client';
import { Expose } from 'class-transformer';

export class AnimalAnimalColorEntity implements Color {
  @ApiProperty({
    description: 'Unique identifier',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
    format: 'uuid',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Name in Russian',
    example: 'Белый',
  })
  @Expose()
  name_ru: string;

  @ApiProperty({
    description: 'Name in Uzbek',
    example: 'Oq',
  })
  @Expose()
  name_uz: string;
}
