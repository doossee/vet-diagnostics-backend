import { ApiProperty } from '@nestjs/swagger';
import { RegionEntity } from './region.entity';
import { MetaDataEntity } from 'src/shared/entities';

export class PaginatedRegionEntity {
  @ApiProperty({
    description: 'Array of regions',
    type: [RegionEntity],
  })
  data: RegionEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
