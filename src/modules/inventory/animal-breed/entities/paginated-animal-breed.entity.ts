import { ApiProperty } from '@nestjs/swagger';
import { AnimalBreedEntity } from './animal-breed.entity';
import { MetaDataEntity } from 'src/shared/entities';

export class PaginatedAnimalBreedEntity {
  @ApiProperty({
    description: 'Array of breeds',
    type: [AnimalBreedEntity],
  })
  data: AnimalBreedEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
