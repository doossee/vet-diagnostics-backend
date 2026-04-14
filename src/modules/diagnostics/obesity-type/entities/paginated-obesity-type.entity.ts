import { ApiProperty } from '@nestjs/swagger';
import { MetaDataEntity } from 'src/shared/entities';
import { ObesityTypeEntity } from './obesity-type.entity';

export class PaginatedObesityTypeEntity {
  @ApiProperty({
    description: 'Array of records',
    type: [ObesityTypeEntity],
  })
  data: ObesityTypeEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
