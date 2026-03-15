import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TrendDataPointEntity {
  @ApiProperty({ description: 'Exam date' })
  @Expose()
  date: Date;

  @ApiProperty({ description: 'Parameter value at this date' })
  @Expose()
  value: number;
}

export class TrendEntity {
  @ApiProperty({ description: 'Parameter name' })
  @Expose()
  parameter: string;

  @ApiProperty({ description: 'Unit of measurement', required: false })
  @Expose()
  unit: string | null;

  @ApiProperty({
    description: 'Data points ordered by date',
    type: [TrendDataPointEntity],
  })
  @Expose()
  dataPoints: TrendDataPointEntity[];

  @ApiProperty({
    description: 'Trend direction based on recent data',
    enum: ['stable', 'increasing', 'decreasing'],
  })
  @Expose()
  trend: 'stable' | 'increasing' | 'decreasing';

  @ApiProperty({
    description: 'Percentage change from first to last data point',
  })
  @Expose()
  changePercent: number;
}
