import { ApiProperty } from '@nestjs/swagger';
import { MetaDataEntity } from 'src/shared/entities';
import { LymphConsistencyEntity } from './lymph-consistency.entity';

export class PaginatedLymphConsistencyEntity {
  @ApiProperty({
    description: 'Array of records',
    type: [LymphConsistencyEntity],
  })
  data: LymphConsistencyEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
