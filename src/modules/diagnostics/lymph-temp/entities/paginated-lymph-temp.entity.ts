import { ApiProperty } from '@nestjs/swagger';
import { MetaDataEntity } from 'src/shared/entities';
import { LymphTempEntity } from './lymph-temp.entity';

export class PaginatedLymphTempEntity {
  @ApiProperty({
    description: 'Array of records',
    type: [LymphTempEntity],
  })
  data: LymphTempEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
