import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateMedicalSessionDto {
  @ApiProperty({
    description: 'UUID of the animal being examined',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  animalId: string;

  @ApiPropertyOptional({
    description: 'UUID of the veterinarian conducting the examination',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsOptional()
  veterinarianId?: string;

  @ApiPropertyOptional({
    description: 'Date of the examination',
    example: '2024-06-15T10:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiPropertyOptional({
    description: 'Notes about the session',
    example: 'Annual checkup',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
