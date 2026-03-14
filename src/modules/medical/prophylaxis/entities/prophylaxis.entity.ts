import { ApiProperty } from '@nestjs/swagger';
import { Prophylaxis, ProphylaxisType } from 'src/generated/prisma/client';
import { Expose } from 'class-transformer';

export class ProphylaxisEntity implements Prophylaxis {
  @ApiProperty({ format: 'uuid' })
  @Expose()
  id: string;

  @ApiProperty({ enum: ProphylaxisType })
  @Expose()
  type: ProphylaxisType;

  @ApiProperty()
  @Expose()
  animalId: string;

  @ApiProperty()
  @Expose()
  itemId: string;

  @ApiProperty({ required: false })
  @Expose()
  detailId: string | null;

  @ApiProperty()
  @Expose()
  date: Date;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
