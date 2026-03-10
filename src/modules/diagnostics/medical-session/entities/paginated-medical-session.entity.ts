import { ApiProperty } from '@nestjs/swagger';
import { MedicalSessionEntity } from './medical-session.entity';
import { MetaDataEntity } from 'src/shared/entities';

export class PaginatedMedicalSessionEntity {
  @ApiProperty({
    description: 'Array of medical sessions',
    type: [MedicalSessionEntity],
  })
  data: MedicalSessionEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
