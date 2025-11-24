import { ApiProperty } from '@nestjs/swagger';
import { UrineExamEntity } from './urine-exam.entity';
import { MetaDataEntity } from 'src/shared/entities';

export class PaginatedUrineExamEntity {
  @ApiProperty({
    description: 'Array of urine exams',
    type: [UrineExamEntity],
  })
  data: UrineExamEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
