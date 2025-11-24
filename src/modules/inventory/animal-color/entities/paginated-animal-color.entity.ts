import { ApiProperty } from '@nestjs/swagger';
import { AnimalAnimalColorEntity } from './animal-color.entity';
import { MetaDataEntity } from 'src/shared/entities';

export class PaginatedAnimalAnimalColorEntity {
  @ApiProperty({
    description: 'Array of colors',
    type: [AnimalAnimalColorEntity],
  })
  data: AnimalAnimalColorEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
