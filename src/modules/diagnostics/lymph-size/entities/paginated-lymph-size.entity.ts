import { ApiProperty } from '@nestjs/swagger';
import { MetaDataEntity } from 'src/shared/entities';
import { LymphSizeEntity } from './lymph-size.entity';

export class PaginatedLymphSizeEntity {
  @ApiProperty({
    description: 'Array of records',
    type: [LymphSizeEntity],
  })
  data: LymphSizeEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
