import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AnimalType } from 'src/generated/prisma/client';
import { Expose } from 'class-transformer';

export class AnimalTypeEntity implements AnimalType {
  @ApiProperty({
    description: 'Unique identifier for the animal type',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
    format: 'uuid',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Name of the animal type in Russian',
    example: 'Крупный рогатый скот',
  })
  @Expose()
  nameRu: string;

  @ApiProperty({
    description: 'Name of the animal type in Uzbek',
    example: 'Qoramol',
  })
  @Expose()
  nameUz: string;

  @ApiPropertyOptional({
    description: 'Parent animal type ID (for hierarchical types)',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
  })
  @Expose()
  parentId: string | null;

  @ApiPropertyOptional({
    description: 'Parent animal type details',
    type: () => AnimalTypeEntity,
  })
  @Expose()
  parent?: AnimalTypeEntity;

  @ApiPropertyOptional({
    description: 'Child animal types',
    type: () => [AnimalTypeEntity],
  })
  @Expose()
  children?: AnimalTypeEntity[];
}
