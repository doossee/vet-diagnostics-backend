import { ApiProperty } from '@nestjs/swagger';
import { MetaDataEntity } from 'src/shared/entities';
import { ConstitutionEntity } from './constitution.entity';

export class PaginatedConstitutionEntity {
  @ApiProperty({
    description: 'Array of records',
    type: [ConstitutionEntity],
  })
  data: ConstitutionEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
