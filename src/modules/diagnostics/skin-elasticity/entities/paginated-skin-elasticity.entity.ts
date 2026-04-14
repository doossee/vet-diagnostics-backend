import { ApiProperty } from '@nestjs/swagger';
import { MetaDataEntity } from 'src/shared/entities';
import { SkinElasticityEntity } from './skin-elasticity.entity';

export class PaginatedSkinElasticityEntity {
  @ApiProperty({
    description: 'Array of records',
    type: [SkinElasticityEntity],
  })
  data: SkinElasticityEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
