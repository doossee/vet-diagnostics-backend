import { ApiProperty } from '@nestjs/swagger';
import { BloodExam } from '@prisma/client';
import { Expose } from 'class-transformer';

export class BloodExamEntity implements BloodExam {
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

  @ApiProperty({ description: 'COE', example: 5.5, required: false })
  @Expose()
  coe: number | null;

  @ApiProperty({
    description: 'Erythrocyte Count',
    example: 5.5,
    required: false,
  })
  @Expose()
  erythrocyteCount: number | null;

  @ApiProperty({
    description: 'Leukocyte Count',
    example: 8.5,
    required: false,
  })
  @Expose()
  leukocyteCount: number | null;

  @ApiProperty({
    description: 'Thrombocyte Count',
    example: 250,
    required: false,
  })
  @Expose()
  thrombocyteCount: number | null;

  @ApiProperty({ description: 'Hemoglobin', example: 120, required: false })
  @Expose()
  hemoglobin: number | null;

  @ApiProperty({ description: 'Glutathione', example: 30, required: false })
  @Expose()
  glutathione: number | null;

  @ApiProperty({
    description: 'Water Percentage',
    example: 80,
    required: false,
  })
  @Expose()
  waterPercentage: number | null;

  @ApiProperty({ description: 'Dry Residue', example: 20, required: false })
  @Expose()
  dryResidue: number | null;

  @ApiProperty({ description: 'Total Protein', example: 70, required: false })
  @Expose()
  totalProtein: number | null;

  @ApiProperty({ description: 'Total Calcium', example: 2.5, required: false })
  @Expose()
  totalCalcium: number | null;

  @ApiProperty({
    description: 'Organic Phosphorus',
    example: 1.5,
    required: false,
  })
  @Expose()
  organicPhosphorus: number | null;

  @ApiProperty({ description: 'Albumin', example: 40, required: false })
  @Expose()
  albumin: number | null;

  @ApiProperty({ description: 'Alpha Globulin', example: 10, required: false })
  @Expose()
  alphaGlobulin: number | null;

  @ApiProperty({ description: 'Beta Globulin', example: 10, required: false })
  @Expose()
  betaGlobulin: number | null;

  @ApiProperty({ description: 'Gamma Globulin', example: 10, required: false })
  @Expose()
  gammaGlobulin: number | null;

  @ApiProperty({
    description: 'Residual Nitrogen',
    example: 20,
    required: false,
  })
  @Expose()
  residualNitrogen: number | null;

  @ApiProperty({ description: 'Urea', example: 5, required: false })
  @Expose()
  urea: number | null;

  @ApiProperty({ description: 'Uric Acid', example: 0.3, required: false })
  @Expose()
  uricAcid: number | null;

  @ApiProperty({ description: 'Creatine', example: 0.1, required: false })
  @Expose()
  creatine: number | null;

  @ApiProperty({ description: 'Creatinine', example: 80, required: false })
  @Expose()
  creatinine: number | null;

  @ApiProperty({
    description: 'Alkaline Reserve',
    example: 50,
    required: false,
  })
  @Expose()
  alkalineReserve: number | null;

  @ApiProperty({ description: 'Glucose', example: 5.5, required: false })
  @Expose()
  glucose: number | null;

  @ApiProperty({ description: 'Ketone Bodies', example: 0, required: false })
  @Expose()
  ketoneBodies: number | null;

  @ApiProperty({ description: 'Total Bilirubin', example: 10, required: false })
  @Expose()
  totalBilirubin: number | null;

  @ApiProperty({ description: 'Direct Bilirubin', example: 2, required: false })
  @Expose()
  directBilirubin: number | null;

  @ApiProperty({
    description: 'Total Cholesterol',
    example: 4,
    required: false,
  })
  @Expose()
  totalCholesterol: number | null;

  @ApiProperty({ description: 'Total Lipids', example: 5, required: false })
  @Expose()
  totalLipids: number | null;

  @ApiProperty({ description: 'Phospholipids', example: 2, required: false })
  @Expose()
  phospholipids: number | null;

  @ApiProperty({ description: 'Lactic Acid', example: 1, required: false })
  @Expose()
  lacticAcid: number | null;

  @ApiProperty({ description: 'Pyruvic Acid', example: 0.1, required: false })
  @Expose()
  pyruvicAcid: number | null;

  @ApiProperty({ description: 'Citric Acid', example: 0.1, required: false })
  @Expose()
  citricAcid: number | null;

  @ApiProperty({ description: 'Carotene', example: 0.5, required: false })
  @Expose()
  carotene: number | null;

  @ApiProperty({ description: 'Vitamin A', example: 1, required: false })
  @Expose()
  vitaminA: number | null;

  @ApiProperty({ description: 'Vitamin B', example: 1, required: false })
  @Expose()
  vitaminB: number | null;

  @ApiProperty({ description: 'Vitamin C', example: 1, required: false })
  @Expose()
  vitaminC: number | null;

  @ApiProperty({
    description: 'Conclusion',
    example: 'Normal',
    required: false,
  })
  @Expose()
  conclusion: string | null;

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
