import { ApiProperty } from '@nestjs/swagger';
import { MetaDataEntity } from 'src/shared/entities';
import { WoolTypeEntity } from './wool-type.entity';

export class PaginatedWoolTypeEntity {
  @ApiProperty({
    description: 'Array of records',
    type: [WoolTypeEntity],
  })
  data: WoolTypeEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
