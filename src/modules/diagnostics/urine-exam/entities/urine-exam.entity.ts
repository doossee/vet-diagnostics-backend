import { ApiProperty } from '@nestjs/swagger';
import { UrineExam, UrineAnalysisType } from '@prisma/client';
import { Expose } from 'class-transformer';

export class UrineExamEntity implements UrineExam {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @Expose()
  id: string;

  @ApiProperty({ enum: UrineAnalysisType })
  @Expose()
  analysisType: UrineAnalysisType;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @Expose()
  animalId: string | null;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @Expose()
  urineColorId: string | null;

  @ApiProperty({ example: 100, required: false })
  @Expose()
  amount: number | null;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @Expose()
  urineClarityId: string | null;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @Expose()
  urineConsistencyId: string | null;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @Expose()
  urineSmellId: string | null;

  @ApiProperty({ example: 6.5, required: false })
  @Expose()
  ph: number | null;

  @ApiProperty({ example: 0.5, required: false })
  @Expose()
  acetone: number | null;

  @ApiProperty({ example: 0.5, required: false })
  @Expose()
  protein: number | null;

  @ApiProperty({ example: 0.5, required: false })
  @Expose()
  bilirubin: number | null;

  @ApiProperty({ example: 0.5, required: false })
  @Expose()
  urobilinogen: number | null;

  @ApiProperty({ example: 0.5, required: false })
  @Expose()
  sugar: number | null;

  @ApiProperty({ example: 5, required: false })
  @Expose()
  leukocytes: number | null;

  @ApiProperty({ example: 5, required: false })
  @Expose()
  epithelium: number | null;

  @ApiProperty({ example: 5, required: false })
  @Expose()
  microbialBodies: number | null;

  @ApiProperty({ example: 5, required: false })
  @Expose()
  erythrocytes: number | null;

  @ApiProperty({ example: 5, required: false })
  @Expose()
  saltCrystals: number | null;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
