import { ApiProperty } from '@nestjs/swagger';
import { MetaDataEntity } from 'src/shared/entities';
import { SkinTempEntity } from './skin-temp.entity';

export class PaginatedSkinTempEntity {
  @ApiProperty({
    description: 'Array of records',
    type: [SkinTempEntity],
  })
  data: SkinTempEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
