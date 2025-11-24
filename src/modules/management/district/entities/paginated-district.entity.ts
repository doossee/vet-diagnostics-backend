import { ApiProperty } from '@nestjs/swagger';
import { DistrictEntity } from './district.entity';
import { MetaDataEntity } from 'src/shared/entities';

export class PaginatedDistrictEntity {
  @ApiProperty({
    description: 'Array of districts',
    type: [DistrictEntity],
  })
  data: DistrictEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
