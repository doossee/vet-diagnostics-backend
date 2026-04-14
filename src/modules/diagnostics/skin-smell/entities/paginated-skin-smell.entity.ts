import { ApiProperty } from '@nestjs/swagger';
import { MetaDataEntity } from 'src/shared/entities';
import { SkinSmellEntity } from './skin-smell.entity';

export class PaginatedSkinSmellEntity {
  @ApiProperty({
    description: 'Array of records',
    type: [SkinSmellEntity],
  })
  data: SkinSmellEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
