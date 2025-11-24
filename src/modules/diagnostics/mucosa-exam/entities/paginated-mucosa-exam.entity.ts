import { ApiProperty } from '@nestjs/swagger';
import { MucosaExamEntity } from './mucosa-exam.entity';
import { MetaDataEntity } from 'src/shared/entities';

export class PaginatedMucosaExamEntity {
  @ApiProperty({
    description: 'Array of mucosa exams',
    type: [MucosaExamEntity],
  })
  data: MucosaExamEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
