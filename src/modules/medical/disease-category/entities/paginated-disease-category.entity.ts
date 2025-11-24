import { ApiProperty } from '@nestjs/swagger';
import { DiseaseCategoryEntity } from './disease-category.entity';
import { MetaDataEntity } from 'src/shared/entities';

export class PaginatedDiseaseCategoryEntity {
  @ApiProperty({ type: [DiseaseCategoryEntity] })
  data: DiseaseCategoryEntity[];

  @ApiProperty({ type: MetaDataEntity })
  meta: MetaDataEntity;
}
