import { ApiProperty } from '@nestjs/swagger';
import { DiseaseEntity } from './disease.entity';
import { MetaDataEntity } from 'src/shared/entities';

export class PaginatedDiseaseEntity {
  @ApiProperty({ type: [DiseaseEntity] })
  data: DiseaseEntity[];

  @ApiProperty({ type: MetaDataEntity })
  meta: MetaDataEntity;
}
