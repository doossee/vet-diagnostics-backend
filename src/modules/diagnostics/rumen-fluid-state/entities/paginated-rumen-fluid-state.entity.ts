import { ApiProperty } from '@nestjs/swagger';
import { MetaDataEntity } from 'src/shared/entities';
import { RumenFluidStateEntity } from './rumen-fluid-state.entity';

export class PaginatedRumenFluidStateEntity {
  @ApiProperty({
    description: 'Array of records',
    type: [RumenFluidStateEntity],
  })
  data: RumenFluidStateEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
