import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class FeedbackEntity {
  @ApiProperty({
    description: 'Unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Prediction ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  predictionId: string;

  @ApiPropertyOptional({
    description: 'Veterinarian ID (set when created by a veterinarian)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  veterinarianId: string | null;

  @ApiPropertyOptional({
    description: 'Admin user ID (set when created by an admin)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  adminId: string | null;

  @ApiProperty({ description: 'Prediction accuracy rating (1-5)', example: 3 })
  @Expose()
  rating: number;

  @ApiPropertyOptional({
    description: 'Feedback comment',
    example: 'Prediction was inaccurate',
  })
  @Expose()
  comment: string | null;

  @ApiPropertyOptional({
    description: 'Suggested correct disease ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  suggestedDiseaseId: string | null;

  @ApiProperty({
    description: 'Creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2023-01-01T00:00:00.000Z',
  })
  @Expose()
  updatedAt: Date;
}
