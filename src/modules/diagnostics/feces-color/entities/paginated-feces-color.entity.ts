import { ApiProperty } from '@nestjs/swagger';
import { FecesColorEntity } from './feces-color.entity';
import { MetaDataEntity } from 'src/shared/entities';

export class PaginatedFecesColorEntity {
  @ApiProperty({
    description: 'Array of feces colors',
    type: [FecesColorEntity],
  })
  data: FecesColorEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
