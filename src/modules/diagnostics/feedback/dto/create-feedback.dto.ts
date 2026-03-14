import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  predictionId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  veterinarianId: string;

  @ApiProperty({ example: 3, description: 'Prediction accuracy rating (1-5)' })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: 'The prediction was incorrect, symptoms suggest a different disease.' })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Suggested correct disease ID' })
  @IsUUID()
  @IsOptional()
  suggestedDiseaseId?: string;
}
