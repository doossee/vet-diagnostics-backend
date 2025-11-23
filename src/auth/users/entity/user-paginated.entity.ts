import { ApiProperty } from '@nestjs/swagger';
import { MetaDataEntity } from 'src/shared/entities';
import { UserEntity } from './user.entity';

export class PaginatedUsersEntity {
  @ApiProperty({ type: [UserEntity] })
  data: UserEntity[];

  @ApiProperty({ type: MetaDataEntity })
  meta: MetaDataEntity;
}
