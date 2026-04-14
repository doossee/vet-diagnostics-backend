import { ApiProperty } from '@nestjs/swagger';
import { MetaDataEntity } from 'src/shared/entities';
import { LymphShapeEntity } from './lymph-shape.entity';

export class PaginatedLymphShapeEntity {
  @ApiProperty({
    description: 'Array of records',
    type: [LymphShapeEntity],
  })
  data: LymphShapeEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
