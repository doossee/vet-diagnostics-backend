import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class HealthSummaryEntity {
  @ApiProperty({ description: 'Animal UUID' })
  @Expose()
  animalId: string;

  @ApiProperty({ description: 'Total active (unresolved) alerts' })
  @Expose()
  activeAlerts: number;

  @ApiProperty({ description: 'Active alerts breakdown by severity' })
  @Expose()
  alertsBySeverity: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
    CRITICAL: number;
  };

  @ApiProperty({
    description: 'Overall health status based on active alerts',
    enum: ['HEALTHY', 'ATTENTION', 'WARNING', 'CRITICAL'],
  })
  @Expose()
  healthStatus: string;

  @ApiProperty({
    description: 'Date of the most recent session',
    required: false,
  })
  @Expose()
  lastSessionDate: Date | null;

  @ApiProperty({ description: 'Total sessions count' })
  @Expose()
  totalSessions: number;
}
