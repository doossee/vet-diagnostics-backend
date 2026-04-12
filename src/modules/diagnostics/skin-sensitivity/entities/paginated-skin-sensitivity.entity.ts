import { ApiProperty } from '@nestjs/swagger';
import { MetaDataEntity } from 'src/shared/entities';
import { SkinSensitivityEntity } from './skin-sensitivity.entity';

export class PaginatedSkinSensitivityEntity {
  @ApiProperty({
    description: 'Array of records',
    type: [SkinSensitivityEntity],
  })
  data: SkinSensitivityEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
