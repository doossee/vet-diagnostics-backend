import { ApiProperty } from '@nestjs/swagger';
import { FecesExam } from '@prisma/client';
import { Expose } from 'class-transformer';

export class FecesExamEntity implements FecesExam {
  @ApiProperty({
    description: 'Unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Animal ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  animalId: string | null;

  @ApiProperty({
    description: 'Session ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @Expose()
  sessionId: string | null;

  @ApiProperty({
    description: 'Feces Color ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  fecesColorId: string | null;

  @ApiProperty({
    description: 'Feces Smell ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  fecesSmellId: string | null;

  @ApiProperty({
    description: 'Feces Consistency ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  fecesConsistencyId: string | null;

  @ApiProperty({
    description: 'Feces Form ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  fecesFormId: string | null;

  @ApiProperty({ description: 'Amount', example: 100, required: false })
  @Expose()
  amount: number | null;

  @ApiProperty({ description: 'Undigested Food', example: 10, required: false })
  @Expose()
  undigestedFood: number | null;

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
