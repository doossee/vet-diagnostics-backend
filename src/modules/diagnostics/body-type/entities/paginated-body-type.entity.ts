import { ApiProperty } from '@nestjs/swagger';
import { MetaDataEntity } from 'src/shared/entities';
import { BodyTypeEntity } from './body-type.entity';

export class PaginatedBodyTypeEntity {
  @ApiProperty({
    description: 'Array of records',
    type: [BodyTypeEntity],
  })
  data: BodyTypeEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
