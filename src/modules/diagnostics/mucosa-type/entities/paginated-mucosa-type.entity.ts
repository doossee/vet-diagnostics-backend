import { ApiProperty } from '@nestjs/swagger';
import { MetaDataEntity } from 'src/shared/entities';
import { MucosaTypeEntity } from './mucosa-type.entity';

export class PaginatedMucosaTypeEntity {
  @ApiProperty({
    description: 'Array of records',
    type: [MucosaTypeEntity],
  })
  data: MucosaTypeEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
