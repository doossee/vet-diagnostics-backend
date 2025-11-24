import { ApiProperty } from '@nestjs/swagger';
import { FecesExam } from '@prisma/client';
import { Expose } from 'class-transformer';

export class FecesExamEntity implements FecesExam {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @Expose()
  id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @Expose()
  animalId: string | null;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @Expose()
  fecesColorId: string | null;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @Expose()
  fecesSmellId: string | null;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @Expose()
  fecesConsistencyId: string | null;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @Expose()
  fecesFormId: string | null;

  @ApiProperty({ example: 100, required: false })
  @Expose()
  amount: number | null;

  @ApiProperty({ example: 5, required: false })
  @Expose()
  undigestedFood: number | null;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
