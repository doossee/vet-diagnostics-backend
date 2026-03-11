import { ApiProperty } from '@nestjs/swagger';
import { Prediction } from '@prisma/client';
import { Expose } from 'class-transformer';
import { JsonValue } from '@prisma/client/runtime/library';

export class PredictionEntity implements Prediction {
  @ApiProperty({ description: 'Unique identifier' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Medical session ID' })
  @Expose()
  sessionId: string;

  @ApiProperty({ description: 'Numeric input vector sent to the AI model' })
  @Expose()
  inputVector: JsonValue;

  @ApiProperty({ description: 'Raw response from the AI model' })
  @Expose()
  rawOutput: JsonValue;

  @ApiProperty({ description: 'Version of the AI model used', required: false })
  @Expose()
  modelVersion: string | null;

  @ApiProperty({ description: 'Prediction creation date' })
  @Expose()
  createdAt: Date;
}
