import { ApiProperty } from '@nestjs/swagger';
import { MetaDataEntity } from 'src/shared/entities';
import { DownTypeEntity } from './down-type.entity';

export class PaginatedDownTypeEntity {
  @ApiProperty({
    description: 'Array of records',
    type: [DownTypeEntity],
  })
  data: DownTypeEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
