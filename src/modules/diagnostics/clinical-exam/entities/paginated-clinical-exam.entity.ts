import { ApiProperty } from '@nestjs/swagger';
import { ClinicalExamEntity } from './clinical-exam.entity';
import { MetaDataEntity } from 'src/shared/entities';

export class PaginatedClinicalExamEntity {
  @ApiProperty({
    description: 'Array of clinical exams',
    type: [ClinicalExamEntity],
  })
  data: ClinicalExamEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
