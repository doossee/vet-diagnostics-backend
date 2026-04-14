import { ApiProperty } from '@nestjs/swagger';
import { MetaDataEntity } from 'src/shared/entities';
import { HairTypeEntity } from './hair-type.entity';

export class PaginatedHairTypeEntity {
  @ApiProperty({
    description: 'Array of records',
    type: [HairTypeEntity],
  })
  data: HairTypeEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
