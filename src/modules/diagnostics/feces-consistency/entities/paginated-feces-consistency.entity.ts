import { ApiProperty } from '@nestjs/swagger';
import { FecesConsistencyEntity } from './feces-consistency.entity';
import { MetaDataEntity } from 'src/shared/entities';

export class PaginatedFecesConsistencyEntity {
  @ApiProperty({
    description: 'Array of feces consistencies',
    type: [FecesConsistencyEntity],
  })
  data: FecesConsistencyEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
