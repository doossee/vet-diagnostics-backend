import { ApiProperty } from '@nestjs/swagger';
import { MetaDataEntity } from 'src/shared/entities';
import { SkinColorEntity } from './skin-color.entity';

export class PaginatedSkinColorEntity {
  @ApiProperty({
    description: 'Array of records',
    type: [SkinColorEntity],
  })
  data: SkinColorEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
