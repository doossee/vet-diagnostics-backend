import { ApiProperty } from '@nestjs/swagger';
import { AnimalAnimalBreedEntity } from './animal-breed.entity';
import { MetaDataEntity } from 'src/shared/entities';

export class PaginatedAnimalAnimalBreedEntity {
  @ApiProperty({
    description: 'Array of breeds',
    type: [AnimalAnimalBreedEntity],
  })
  data: AnimalAnimalBreedEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
