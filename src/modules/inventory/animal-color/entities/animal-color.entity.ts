import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AnimalColorEntity {
  @ApiProperty({
    description: 'Unique identifier',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
    format: 'uuid',
  })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Localized name', example: { ru: 'Название', uz: 'Nomi' } })
  @Expose()
  name: { ru: string; uz: string };
}
