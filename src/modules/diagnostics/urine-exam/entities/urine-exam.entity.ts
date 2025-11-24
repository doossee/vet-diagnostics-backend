import { ApiProperty } from '@nestjs/swagger';
import { UrineExam, UrineAnalysisType } from '@prisma/client';
import { Expose } from 'class-transformer';

export class UrineExamEntity implements UrineExam {
  @ApiProperty({
    description: 'Unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Analysis Type',
    enum: UrineAnalysisType,
  })
  @Expose()
  analysisType: UrineAnalysisType;

  @ApiProperty({
    description: 'Animal ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  animalId: string | null;

  @ApiProperty({
    description: 'Urine Color ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  urineColorId: string | null;

  @ApiProperty({
    description: 'Urine Smell ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  urineSmellId: string | null;

  @ApiProperty({
    description: 'Urine Clarity ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  urineClarityId: string | null;

  @ApiProperty({
    description: 'Urine Consistency ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  urineConsistencyId: string | null;

  @ApiProperty({ description: 'Amount', example: 100, required: false })
  @Expose()
  amount: number | null;

  @ApiProperty({ description: 'pH', example: 7.0, required: false })
  @Expose()
  ph: number | null;

  @ApiProperty({ description: 'Acetone', example: 0, required: false })
  @Expose()
  acetone: number | null;

  @ApiProperty({ description: 'Protein', example: 0, required: false })
  @Expose()
  protein: number | null;

  @ApiProperty({ description: 'Bilirubin', example: 0, required: false })
  @Expose()
  bilirubin: number | null;

  @ApiProperty({ description: 'Urobilinogen', example: 0, required: false })
  @Expose()
  urobilinogen: number | null;

  @ApiProperty({ description: 'Sugar', example: 0, required: false })
  @Expose()
  sugar: number | null;

  @ApiProperty({ description: 'Leukocytes', example: 0, required: false })
  @Expose()
  leukocytes: number | null;

  @ApiProperty({ description: 'Epithelium', example: 0, required: false })
  @Expose()
  epithelium: number | null;

  @ApiProperty({ description: 'Microbial Bodies', example: 0, required: false })
  @Expose()
  microbialBodies: number | null;

  @ApiProperty({ description: 'Erythrocytes', example: 0, required: false })
  @Expose()
  erythrocytes: number | null;

  @ApiProperty({ description: 'Salt Crystals', example: 0, required: false })
  @Expose()
  saltCrystals: number | null;

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
