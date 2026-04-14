import { ApiProperty } from '@nestjs/swagger';
import { MetaDataEntity } from 'src/shared/entities';
import { BodyPositionEntity } from './body-position.entity';

export class PaginatedBodyPositionEntity {
  @ApiProperty({
    description: 'Array of records',
    type: [BodyPositionEntity],
  })
  data: BodyPositionEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
