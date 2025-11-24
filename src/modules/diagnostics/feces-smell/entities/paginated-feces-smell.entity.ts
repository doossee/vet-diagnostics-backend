import { ApiProperty } from '@nestjs/swagger';
import { FecesSmellEntity } from './feces-smell.entity';
import { MetaDataEntity } from 'src/shared/entities';

export class PaginatedFecesSmellEntity {
  @ApiProperty({
    description: 'Array of feces smells',
    type: [FecesSmellEntity],
  })
  data: FecesSmellEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
