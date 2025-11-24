import { ApiProperty } from '@nestjs/swagger';
import { BloodExamEntity } from './blood-exam.entity';
import { MetaDataEntity } from 'src/shared/entities';

export class PaginatedBloodExamEntity {
  @ApiProperty({
    description: 'Array of blood exams',
    type: [BloodExamEntity],
  })
  data: BloodExamEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
