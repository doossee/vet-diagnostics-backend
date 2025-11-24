import { ApiProperty } from '@nestjs/swagger';
import { BloodExam } from '@prisma/client';
import { Expose } from 'class-transformer';

export class BloodExamEntity implements BloodExam {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @Expose()
  id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @Expose()
  animalId: string | null;

  @ApiProperty({ example: 5.5, required: false })
  @Expose()
  coe: number | null;

  @ApiProperty({ example: 4.5, required: false })
  @Expose()
  erythrocyteCount: number | null;

  @ApiProperty({ example: 7.5, required: false })
  @Expose()
  leukocyteCount: number | null;

  @ApiProperty({ example: 250, required: false })
  @Expose()
  thrombocyteCount: number | null;

  @ApiProperty({ example: 120, required: false })
  @Expose()
  hemoglobin: number | null;

  @ApiProperty({ example: 2.5, required: false })
  @Expose()
  glutathione: number | null;

  @ApiProperty({ example: 80, required: false })
  @Expose()
  waterPercentage: number | null;

  @ApiProperty({ example: 20, required: false })
  @Expose()
  dryResidue: number | null;

  @ApiProperty({ example: 70, required: false })
  @Expose()
  totalProtein: number | null;

  @ApiProperty({ example: 2.5, required: false })
  @Expose()
  totalCalcium: number | null;

  @ApiProperty({ example: 1.5, required: false })
  @Expose()
  organicPhosphorus: number | null;

  @ApiProperty({ example: 40, required: false })
  @Expose()
  albumin: number | null;

  @ApiProperty({ example: 10, required: false })
  @Expose()
  alphaGlobulin: number | null;

  @ApiProperty({ example: 10, required: false })
  @Expose()
  betaGlobulin: number | null;

  @ApiProperty({ example: 10, required: false })
  @Expose()
  gammaGlobulin: number | null;

  @ApiProperty({ example: 15, required: false })
  @Expose()
  residualNitrogen: number | null;

  @ApiProperty({ example: 5, required: false })
  @Expose()
  urea: number | null;

  @ApiProperty({ example: 0.3, required: false })
  @Expose()
  uricAcid: number | null;

  @ApiProperty({ example: 0.1, required: false })
  @Expose()
  creatine: number | null;

  @ApiProperty({ example: 80, required: false })
  @Expose()
  creatinine: number | null;

  @ApiProperty({ example: 50, required: false })
  @Expose()
  alkalineReserve: number | null;

  @ApiProperty({ example: 5.5, required: false })
  @Expose()
  glucose: number | null;

  @ApiProperty({ example: 0.5, required: false })
  @Expose()
  ketoneBodies: number | null;

  @ApiProperty({ example: 10, required: false })
  @Expose()
  totalBilirubin: number | null;

  @ApiProperty({ example: 2, required: false })
  @Expose()
  directBilirubin: number | null;

  @ApiProperty({ example: 4.5, required: false })
  @Expose()
  totalCholesterol: number | null;

  @ApiProperty({ example: 3.5, required: false })
  @Expose()
  totalLipids: number | null;

  @ApiProperty({ example: 2.5, required: false })
  @Expose()
  phospholipids: number | null;

  @ApiProperty({ example: 1.5, required: false })
  @Expose()
  lacticAcid: number | null;

  @ApiProperty({ example: 0.5, required: false })
  @Expose()
  pyruvicAcid: number | null;

  @ApiProperty({ example: 0.2, required: false })
  @Expose()
  citricAcid: number | null;

  @ApiProperty({ example: 0.1, required: false })
  @Expose()
  carotene: number | null;

  @ApiProperty({ example: 0.5, required: false })
  @Expose()
  vitaminA: number | null;

  @ApiProperty({ example: 0.5, required: false })
  @Expose()
  vitaminB: number | null;

  @ApiProperty({ example: 0.5, required: false })
  @Expose()
  vitaminC: number | null;

  @ApiProperty({ example: 'Healthy', required: false })
  @Expose()
  conclusion: string | null;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
