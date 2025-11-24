import { ApiProperty } from '@nestjs/swagger';
import { FecesFormEntity } from './feces-form.entity';
import { MetaDataEntity } from 'src/shared/entities';

export class PaginatedFecesFormEntity {
  @ApiProperty({
    description: 'Array of feces forms',
    type: [FecesFormEntity],
  })
  data: FecesFormEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
