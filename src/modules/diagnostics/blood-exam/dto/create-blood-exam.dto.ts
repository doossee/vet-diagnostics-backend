import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateBloodExamDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsOptional()
  animalId?: string;

  @ApiPropertyOptional({ example: 5.5 })
  @IsNumber()
  @IsOptional()
  coe?: number;

  @ApiPropertyOptional({ example: 4.5 })
  @IsNumber()
  @IsOptional()
  erythrocyteCount?: number;

  @ApiPropertyOptional({ example: 7.5 })
  @IsNumber()
  @IsOptional()
  leukocyteCount?: number;

  @ApiPropertyOptional({ example: 250 })
  @IsNumber()
  @IsOptional()
  thrombocyteCount?: number;

  @ApiPropertyOptional({ example: 120 })
  @IsNumber()
  @IsOptional()
  hemoglobin?: number;

  @ApiPropertyOptional({ example: 2.5 })
  @IsNumber()
  @IsOptional()
  glutathione?: number;

  @ApiPropertyOptional({ example: 80 })
  @IsNumber()
  @IsOptional()
  waterPercentage?: number;

  @ApiPropertyOptional({ example: 20 })
  @IsNumber()
  @IsOptional()
  dryResidue?: number;

  @ApiPropertyOptional({ example: 70 })
  @IsNumber()
  @IsOptional()
  totalProtein?: number;

  @ApiPropertyOptional({ example: 2.5 })
  @IsNumber()
  @IsOptional()
  totalCalcium?: number;

  @ApiPropertyOptional({ example: 1.5 })
  @IsNumber()
  @IsOptional()
  organicPhosphorus?: number;

  @ApiPropertyOptional({ example: 40 })
  @IsNumber()
  @IsOptional()
  albumin?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsNumber()
  @IsOptional()
  alphaGlobulin?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsNumber()
  @IsOptional()
  betaGlobulin?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsNumber()
  @IsOptional()
  gammaGlobulin?: number;

  @ApiPropertyOptional({ example: 15 })
  @IsNumber()
  @IsOptional()
  residualNitrogen?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsNumber()
  @IsOptional()
  urea?: number;

  @ApiPropertyOptional({ example: 0.3 })
  @IsNumber()
  @IsOptional()
  uricAcid?: number;

  @ApiPropertyOptional({ example: 0.1 })
  @IsNumber()
  @IsOptional()
  creatine?: number;

  @ApiPropertyOptional({ example: 80 })
  @IsNumber()
  @IsOptional()
  creatinine?: number;

  @ApiPropertyOptional({ example: 50 })
  @IsNumber()
  @IsOptional()
  alkalineReserve?: number;

  @ApiPropertyOptional({ example: 5.5 })
  @IsNumber()
  @IsOptional()
  glucose?: number;

  @ApiPropertyOptional({ example: 0.5 })
  @IsNumber()
  @IsOptional()
  ketoneBodies?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsNumber()
  @IsOptional()
  totalBilirubin?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsNumber()
  @IsOptional()
  directBilirubin?: number;

  @ApiPropertyOptional({ example: 4.5 })
  @IsNumber()
  @IsOptional()
  totalCholesterol?: number;

  @ApiPropertyOptional({ example: 3.5 })
  @IsNumber()
  @IsOptional()
  totalLipids?: number;

  @ApiPropertyOptional({ example: 2.5 })
  @IsNumber()
  @IsOptional()
  phospholipids?: number;

  @ApiPropertyOptional({ example: 1.5 })
  @IsNumber()
  @IsOptional()
  lacticAcid?: number;

  @ApiPropertyOptional({ example: 0.5 })
  @IsNumber()
  @IsOptional()
  pyruvicAcid?: number;

  @ApiPropertyOptional({ example: 0.2 })
  @IsNumber()
  @IsOptional()
  citricAcid?: number;

  @ApiPropertyOptional({ example: 0.1 })
  @IsNumber()
  @IsOptional()
  carotene?: number;

  @ApiPropertyOptional({ example: 0.5 })
  @IsNumber()
  @IsOptional()
  vitaminA?: number;

  @ApiPropertyOptional({ example: 0.5 })
  @IsNumber()
  @IsOptional()
  vitaminB?: number;

  @ApiPropertyOptional({ example: 0.5 })
  @IsNumber()
  @IsOptional()
  vitaminC?: number;

  @ApiPropertyOptional({ example: 'Healthy' })
  @IsString()
  @IsOptional()
  conclusion?: string;
}
