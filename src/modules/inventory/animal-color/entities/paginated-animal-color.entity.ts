import { ApiProperty } from '@nestjs/swagger';
import { AnimalColorEntity } from './animal-color.entity';
import { MetaDataEntity } from 'src/shared/entities';

export class PaginatedAnimalColorEntity {
  @ApiProperty({
    description: 'Array of colors',
    type: [AnimalColorEntity],
  })
  data: AnimalColorEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
