import { ApiProperty } from '@nestjs/swagger';
import { MetaDataEntity } from 'src/shared/entities';
import { FeatherTypeEntity } from './feather-type.entity';

export class PaginatedFeatherTypeEntity {
  @ApiProperty({
    description: 'Array of records',
    type: [FeatherTypeEntity],
  })
  data: FeatherTypeEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
