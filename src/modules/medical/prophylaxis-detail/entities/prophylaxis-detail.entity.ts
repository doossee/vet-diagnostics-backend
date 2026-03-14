import { ApiProperty } from '@nestjs/swagger';
import { ProphylaxisDetail } from 'src/generated/prisma/client';
import { Expose } from 'class-transformer';

export class ProphylaxisDetailEntity implements ProphylaxisDetail {
  @ApiProperty({ format: 'uuid' })
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  nameRu: string;

  @ApiProperty()
  @Expose()
  nameUz: string;

  @ApiProperty()
  @Expose()
  itemId: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
