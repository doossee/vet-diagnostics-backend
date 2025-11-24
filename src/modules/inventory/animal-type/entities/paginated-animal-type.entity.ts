import { ApiProperty } from '@nestjs/swagger';
import { AnimalTypeEntity } from './animal-type.entity';
import { MetaDataEntity } from 'src/shared/entities';

export class PaginatedAnimalTypeEntity {
  @ApiProperty({ type: [AnimalTypeEntity] })
  data: AnimalTypeEntity[];

  @ApiProperty({ type: MetaDataEntity })
  meta: MetaDataEntity;
}
