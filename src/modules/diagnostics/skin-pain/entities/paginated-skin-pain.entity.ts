import { ApiProperty } from '@nestjs/swagger';
import { MetaDataEntity } from 'src/shared/entities';
import { SkinPainEntity } from './skin-pain.entity';

export class PaginatedSkinPainEntity {
  @ApiProperty({
    description: 'Array of records',
    type: [SkinPainEntity],
  })
  data: SkinPainEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
