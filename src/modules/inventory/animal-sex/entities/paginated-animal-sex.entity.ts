import { ApiProperty } from '@nestjs/swagger';
import { MetaDataEntity } from 'src/shared/entities';
import { AnimalSexEntity } from './animal-sex.entity';

export class PaginatedAnimalSexEntity {
  @ApiProperty({
    description: 'Array of records',
    type: [AnimalSexEntity],
  })
  data: AnimalSexEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
