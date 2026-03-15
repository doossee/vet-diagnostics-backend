import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

enum AlertStatusUpdate {
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED',
}

export class UpdateAlertDto {
  @ApiProperty({
    description: 'New alert status',
    enum: AlertStatusUpdate,
  })
  @IsEnum(AlertStatusUpdate)
  @IsNotEmpty()
  status: AlertStatusUpdate;
}
