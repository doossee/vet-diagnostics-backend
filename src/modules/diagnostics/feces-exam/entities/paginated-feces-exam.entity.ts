import { ApiProperty } from '@nestjs/swagger';
import { FecesExamEntity } from './feces-exam.entity';
import { MetaDataEntity } from 'src/shared/entities';

export class PaginatedFecesExamEntity {
  @ApiProperty({
    description: 'Array of feces exams',
    type: [FecesExamEntity],
  })
  data: FecesExamEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
