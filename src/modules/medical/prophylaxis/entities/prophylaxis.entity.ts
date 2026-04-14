import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prophylaxis } from 'src/generated/prisma/client';
import { ProphylaxisType } from 'src/shared/enums';
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

  @ApiPropertyOptional()
  @Expose()
  notes: string | null;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
