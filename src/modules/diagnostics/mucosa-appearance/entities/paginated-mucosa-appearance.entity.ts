import { ApiProperty } from '@nestjs/swagger';
import { MucosaAppearanceEntity } from './mucosa-appearance.entity';
import { MetaDataEntity } from 'src/shared/entities';

export class PaginatedMucosaAppearanceEntity {
  @ApiProperty({
    description: 'Array of mucosa appearances',
    type: [MucosaAppearanceEntity],
  })
  data: MucosaAppearanceEntity[];

  @ApiProperty({ description: 'Pagination metadata', type: MetaDataEntity })
  meta: MetaDataEntity;
}
