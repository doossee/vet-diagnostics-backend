import { ApiProperty } from '@nestjs/swagger';
import { ReferenceRange } from 'src/generated/prisma/client';
import { Expose } from 'class-transformer';

export class ReferenceRangeEntity implements ReferenceRange {
  @ApiProperty({ description: 'Reference range UUID' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Animal type UUID' })
  @Expose()
  animalTypeId: string;

  @ApiProperty({ description: 'Parameter name' })
  @Expose()
  parameter: string;

  @ApiProperty({ description: 'Minimum normal value' })
  @Expose()
  minValue: number;

  @ApiProperty({ description: 'Maximum normal value' })
  @Expose()
  maxValue: number;

  @ApiProperty({ description: 'Unit of measurement', required: false })
  @Expose()
  unit: string | null;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
