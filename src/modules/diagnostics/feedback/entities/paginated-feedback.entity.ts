import { ApiProperty } from '@nestjs/swagger';
import { FeedbackEntity } from './feedback.entity';
import { MetaDataEntity } from 'src/shared/entities';

export class PaginatedFeedbackEntity {
  @ApiProperty({
    description: 'Array of feedbacks',
    type: [FeedbackEntity],
  })
  data: FeedbackEntity[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaDataEntity,
  })
  meta: MetaDataEntity;
}
