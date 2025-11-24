import { ApiProperty } from '@nestjs/swagger';
import { ProphylaxisDetailEntity } from './prophylaxis-detail.entity';
import { MetaDataEntity } from 'src/shared/entities';

export class PaginatedProphylaxisDetailEntity {
  @ApiProperty({ type: [ProphylaxisDetailEntity] })
  data: ProphylaxisDetailEntity[];

  @ApiProperty({ type: MetaDataEntity })
  meta: MetaDataEntity;
}
