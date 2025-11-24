import { ApiProperty } from '@nestjs/swagger';
import { ProphylaxisItemEntity } from './prophylaxis-item.entity';
import { MetaDataEntity } from 'src/shared/entities';

export class PaginatedProphylaxisItemEntity {
  @ApiProperty({ type: [ProphylaxisItemEntity] })
  data: ProphylaxisItemEntity[];

  @ApiProperty({ type: MetaDataEntity })
  meta: MetaDataEntity;
}
