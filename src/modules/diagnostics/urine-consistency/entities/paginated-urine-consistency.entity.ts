import { ApiProperty } from '@nestjs/swagger';
import { UrineConsistencyEntity } from './urine-consistency.entity';
import { MetaDataEntity } from 'src/shared/entities';

export class PaginatedUrineConsistencyEntity {
  @ApiProperty({
    description: 'Array of urine consistencies',
    type: [UrineConsistencyEntity],
  })
  data: UrineConsistencyEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
