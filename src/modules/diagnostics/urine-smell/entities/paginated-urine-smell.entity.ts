import { ApiProperty } from '@nestjs/swagger';
import { UrineSmellEntity } from './urine-smell.entity';
import { MetaDataEntity } from 'src/shared/entities';

export class PaginatedUrineSmellEntity {
  @ApiProperty({
    description: 'Array of urine smells',
    type: [UrineSmellEntity],
  })
  data: UrineSmellEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
