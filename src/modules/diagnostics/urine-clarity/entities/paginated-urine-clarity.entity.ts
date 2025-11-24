import { ApiProperty } from '@nestjs/swagger';
import { UrineClarityEntity } from './urine-clarity.entity';
import { MetaDataEntity } from 'src/shared/entities';

export class PaginatedUrineClarityEntity {
  @ApiProperty({
    description: 'Array of urine clarities',
    type: [UrineClarityEntity],
  })
  data: UrineClarityEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
