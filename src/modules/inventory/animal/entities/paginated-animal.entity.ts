import { ApiProperty } from '@nestjs/swagger';
import { AnimalEntity } from './animal.entity';
import { MetaDataEntity } from 'src/shared/entities';

export class PaginatedAnimalEntity {
  @ApiProperty({ type: [AnimalEntity] })
  data: AnimalEntity[];

  @ApiProperty({ type: MetaDataEntity })
  meta: MetaDataEntity;
}
