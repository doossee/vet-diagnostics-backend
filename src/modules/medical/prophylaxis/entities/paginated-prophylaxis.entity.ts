import { ApiProperty } from '@nestjs/swagger';
import { ProphylaxisEntity } from './prophylaxis.entity';
import { MetaDataEntity } from 'src/shared/entities';

export class PaginatedProphylaxisEntity {
  @ApiProperty({ type: [ProphylaxisEntity] })
  data: ProphylaxisEntity[];

  @ApiProperty({ type: MetaDataEntity })
  meta: MetaDataEntity;
}
