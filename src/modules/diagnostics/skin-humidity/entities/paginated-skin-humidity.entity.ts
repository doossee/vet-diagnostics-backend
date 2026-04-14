import { ApiProperty } from '@nestjs/swagger';
import { MetaDataEntity } from 'src/shared/entities';
import { SkinHumidityEntity } from './skin-humidity.entity';

export class PaginatedSkinHumidityEntity {
  @ApiProperty({
    description: 'Array of records',
    type: [SkinHumidityEntity],
  })
  data: SkinHumidityEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
