import { ApiProperty } from '@nestjs/swagger';
import { UrineColorEntity } from './urine-color.entity';
import { MetaDataEntity } from 'src/shared/entities';

export class PaginatedUrineColorEntity {
  @ApiProperty({
    description: 'Array of urine colors',
    type: [UrineColorEntity],
  })
  data: UrineColorEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
