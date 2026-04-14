import { ApiProperty } from '@nestjs/swagger';
import { MetaDataEntity } from 'src/shared/entities';
import { TemperamentEntity } from './temperament.entity';

export class PaginatedTemperamentEntity {
  @ApiProperty({
    description: 'Array of records',
    type: [TemperamentEntity],
  })
  data: TemperamentEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
