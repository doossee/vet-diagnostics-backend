import { ApiProperty } from '@nestjs/swagger';
import { MetaDataEntity } from 'src/shared/entities';
import { LymphMobilityEntity } from './lymph-mobility.entity';

export class PaginatedLymphMobilityEntity {
  @ApiProperty({
    description: 'Array of records',
    type: [LymphMobilityEntity],
  })
  data: LymphMobilityEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
