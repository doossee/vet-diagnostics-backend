import { ApiProperty } from '@nestjs/swagger';
import { ProphylaxisItem, ProphylaxisType } from '@prisma/client';
import { Expose } from 'class-transformer';

export class ProphylaxisItemEntity implements ProphylaxisItem {
  @ApiProperty({ format: 'uuid' })
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name_ru: string;

  @ApiProperty()
  @Expose()
  name_uz: string;

  @ApiProperty({ enum: ProphylaxisType })
  @Expose()
  type: ProphylaxisType;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
