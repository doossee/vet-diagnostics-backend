import { ApiProperty } from '@nestjs/swagger';
import { MetaDataEntity } from 'src/shared/entities';
import { LymphSurfaceEntity } from './lymph-surface.entity';

export class PaginatedLymphSurfaceEntity {
  @ApiProperty({
    description: 'Array of records',
    type: [LymphSurfaceEntity],
  })
  data: LymphSurfaceEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
