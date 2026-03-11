import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class CreateMucosaExamDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Mucosa type lookup ID' })
  @IsUUID()
  @IsOptional()
  mucosaTypeId?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsOptional()
  animalId?: string;

  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Medical session ID' })
  @IsUUID()
  @IsOptional()
  sessionId?: string;

  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsOptional()
  mucosaAppearanceId?: string;
}
