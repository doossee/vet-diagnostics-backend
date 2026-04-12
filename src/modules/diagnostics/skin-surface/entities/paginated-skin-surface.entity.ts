import { ApiProperty } from '@nestjs/swagger';
import { MetaDataEntity } from 'src/shared/entities';
import { SkinSurfaceEntity } from './skin-surface.entity';

export class PaginatedSkinSurfaceEntity {
  @ApiProperty({
    description: 'Array of records',
    type: [SkinSurfaceEntity],
  })
  data: SkinSurfaceEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
