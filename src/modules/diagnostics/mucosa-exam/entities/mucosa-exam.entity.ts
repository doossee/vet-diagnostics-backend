import { ApiProperty } from '@nestjs/swagger';
import { MucosaExam } from '@prisma/client';
import { Expose } from 'class-transformer';

export class MucosaExamEntity implements MucosaExam {
  @ApiProperty({ description: 'Unique identifier', example: '123e4567-e89b-12d3-a456-426614174000' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Mucosa Type ID', example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  @Expose()
  mucosaTypeId: string | null;

  @ApiProperty({ description: 'Animal ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @Expose()
  animalId: string | null;

  @ApiProperty({ description: 'Mucosa Appearance ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @Expose()
  mucosaAppearanceId: string | null;

  @ApiProperty({ description: 'Creation date', example: '2023-01-01T00:00:00.000Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Last update date', example: '2023-01-01T00:00:00.000Z' })
  @Expose()
  updatedAt: Date;
}
