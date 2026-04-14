import { ApiProperty } from '@nestjs/swagger';
import { AnomalyAlert } from 'src/generated/prisma/client';
import { AlertSeverity, AlertStatus } from 'src/shared/enums';
import { Expose } from 'class-transformer';

export class AnomalyAlertEntity implements AnomalyAlert {
  @ApiProperty({ description: 'Alert UUID' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Animal UUID' })
  @Expose()
  animalId: string;

  @ApiProperty({ description: 'Medical session UUID' })
  @Expose()
  sessionId: string;

  @ApiProperty({ description: 'Parameter name that deviated' })
  @Expose()
  parameter: string;

  @ApiProperty({ description: 'Actual measured value' })
  @Expose()
  value: number;

  @ApiProperty({ description: 'Normal range minimum' })
  @Expose()
  minNorm: number;

  @ApiProperty({ description: 'Normal range maximum' })
  @Expose()
  maxNorm: number;

  @ApiProperty({ enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] })
  @Expose()
  severity: AlertSeverity;

  @ApiProperty({ enum: ['NEW', 'ACKNOWLEDGED', 'RESOLVED'] })
  @Expose()
  status: AlertStatus;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
