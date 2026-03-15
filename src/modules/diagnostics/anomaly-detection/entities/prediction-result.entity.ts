import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PredictionResultEntity {
  @ApiProperty({ description: 'Raw AI model output (disease predictions)' })
  @Expose()
  predictions: Record<string, any>;

  @ApiProperty({
    description: 'List of detected anomalies (values outside normal ranges)',
    type: 'array',
  })
  @Expose()
  anomalies: {
    parameter: string;
    value: number;
    minNorm: number;
    maxNorm: number;
    severity: string;
  }[];

  @ApiProperty({
    description: 'Overall severity (worst anomaly severity, or OK if none)',
    enum: ['OK', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
  })
  @Expose()
  overallSeverity: string;

  @ApiProperty({ description: 'Session UUID if linked', required: false })
  @Expose()
  sessionId?: string;
}
