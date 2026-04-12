import { ApiProperty } from '@nestjs/swagger';
import { MetaDataEntity } from 'src/shared/entities';
import { LymphPainEntity } from './lymph-pain.entity';

export class PaginatedLymphPainEntity {
  @ApiProperty({
    description: 'Array of records',
    type: [LymphPainEntity],
  })
  data: LymphPainEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
