import { ApiProperty } from '@nestjs/swagger';
import { VetStationEntity } from './vet-station.entity';
import { MetaDataEntity } from 'src/shared/entities';

export class PaginatedVetStationEntity {
  @ApiProperty({
    description: 'Array of vet stations',
    type: [VetStationEntity],
  })
  data: VetStationEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
