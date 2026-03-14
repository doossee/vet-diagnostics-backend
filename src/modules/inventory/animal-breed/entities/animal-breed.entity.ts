import { ApiProperty } from '@nestjs/swagger';
import { Breed } from 'src/generated/prisma/client';
import { Expose } from 'class-transformer';

export class AnimalBreedEntity implements Breed {
  @ApiProperty({
    description: 'Unique identifier',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
    format: 'uuid',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Name in Russian',
    example: 'Голштинская порода',
  })
  @Expose()
  nameRu: string;

  @ApiProperty({
    description: 'Name in Uzbek',
    example: 'Holstein',
  })
  @Expose()
  nameUz: string;
}
