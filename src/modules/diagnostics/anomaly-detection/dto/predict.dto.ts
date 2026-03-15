import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

/**
 * Accepts all 85 features for AI disease prediction.
 * Maps directly to the document specification:
 * - Features 1-3: Physical (pulse, respiration, temperature)
 * - Features 4-11: Whole blood
 * - Features 12-41: Blood serum
 * - Features 42-57: Urine
 * - Features 58-63: Feces
 * - Features 64-67: Mucosa (oral, nasal, ocular, vaginal)
 * - Features 68-85: Clinical observations
 */
export class PredictDto {
  @ApiProperty({ description: 'Animal type UUID (one of 4 cattle types)' })
  @IsUUID()
  @IsNotEmpty()
  animalTypeId: string;

  @ApiPropertyOptional({ description: 'Animal UUID (for tracking/alerts)' })
  @IsUUID()
  @IsOptional()
  animalId?: string;

  @ApiPropertyOptional({
    description: 'Medical session UUID (for linking alerts)',
  })
  @IsUUID()
  @IsOptional()
  sessionId?: string;

  // ── Physical indicators (1-3) ──
  @ApiPropertyOptional({ description: '1. Pulse (beats/min)' })
  @IsNumber()
  @IsOptional()
  pulse?: number;

  @ApiPropertyOptional({ description: '2. Respiration (breaths/min)' })
  @IsNumber()
  @IsOptional()
  respiratoryRate?: number;

  @ApiPropertyOptional({ description: '3. Temperature (°C)' })
  @IsNumber()
  @IsOptional()
  temperature?: number;

  // ── Whole blood (4-11) ──
  @ApiPropertyOptional({ description: '4. Erythrocytes (mln/mcl)' })
  @IsNumber()
  @IsOptional()
  erythrocyteCount?: number;

  @ApiPropertyOptional({ description: '5. Leukocytes (thous/mcl)' })
  @IsNumber()
  @IsOptional()
  leukocyteCount?: number;

  @ApiPropertyOptional({ description: '6. Thrombocytes (thous/mcl)' })
  @IsNumber()
  @IsOptional()
  thrombocyteCount?: number;

  @ApiPropertyOptional({ description: '7. ESR / COE (mm/h)' })
  @IsNumber()
  @IsOptional()
  coe?: number;

  @ApiPropertyOptional({ description: '8. Water (%)' })
  @IsNumber()
  @IsOptional()
  waterPercentage?: number;

  @ApiPropertyOptional({ description: '9. Dry residue (%)' })
  @IsNumber()
  @IsOptional()
  dryResidue?: number;

  @ApiPropertyOptional({ description: '10. Glutathione (mmol/l)' })
  @IsNumber()
  @IsOptional()
  glutathione?: number;

  @ApiPropertyOptional({ description: '11. Hemoglobin (g/l)' })
  @IsNumber()
  @IsOptional()
  hemoglobin?: number;

  // ── Blood serum (12-41) ──
  @ApiPropertyOptional({ description: '12. Total protein (g/l)' })
  @IsNumber()
  @IsOptional()
  totalProtein?: number;

  @ApiPropertyOptional({ description: '13. Albumins (%)' })
  @IsNumber()
  @IsOptional()
  albumin?: number;

  @ApiPropertyOptional({ description: '14. Alpha-globulins (%)' })
  @IsNumber()
  @IsOptional()
  alphaGlobulin?: number;

  @ApiPropertyOptional({ description: '15. Beta-globulins (%)' })
  @IsNumber()
  @IsOptional()
  betaGlobulin?: number;

  @ApiPropertyOptional({ description: '16. Gamma-globulins (%)' })
  @IsNumber()
  @IsOptional()
  gammaGlobulin?: number;

  @ApiPropertyOptional({ description: '17. Residual nitrogen (mmol/l)' })
  @IsNumber()
  @IsOptional()
  residualNitrogen?: number;

  @ApiPropertyOptional({ description: '18. Urea (mmol/l)' })
  @IsNumber()
  @IsOptional()
  urea?: number;

  @ApiPropertyOptional({ description: '19. Uric acid (mmol/l)' })
  @IsNumber()
  @IsOptional()
  uricAcid?: number;

  @ApiPropertyOptional({ description: '20. Creatinine (mcmol/l)' })
  @IsNumber()
  @IsOptional()
  creatinine?: number;

  @ApiPropertyOptional({ description: '21. Alkaline reserve (vol% CO2)' })
  @IsNumber()
  @IsOptional()
  alkalineReserve?: number;

  @ApiPropertyOptional({ description: '22. Glucose (mmol/l)' })
  @IsNumber()
  @IsOptional()
  glucose?: number;

  @ApiPropertyOptional({ description: '23. Ketone bodies (g/l)' })
  @IsNumber()
  @IsOptional()
  ketoneBodies?: number;

  @ApiPropertyOptional({ description: '24. Total bilirubin (mcmol/l)' })
  @IsNumber()
  @IsOptional()
  totalBilirubin?: number;

  @ApiPropertyOptional({ description: '25. Direct bilirubin (mcmol/l)' })
  @IsNumber()
  @IsOptional()
  directBilirubin?: number;

  @ApiPropertyOptional({ description: '26. Total cholesterol (mmol/l)' })
  @IsNumber()
  @IsOptional()
  totalCholesterol?: number;

  @ApiPropertyOptional({ description: '27. Total lipids (g/l)' })
  @IsNumber()
  @IsOptional()
  totalLipids?: number;

  @ApiPropertyOptional({ description: '28. Phospholipids (g/l)' })
  @IsNumber()
  @IsOptional()
  phospholipids?: number;

  @ApiPropertyOptional({ description: '29. Lactic acid (mmol/l)' })
  @IsNumber()
  @IsOptional()
  lacticAcid?: number;

  @ApiPropertyOptional({ description: '30. Pyruvic acid (mmol/l)' })
  @IsNumber()
  @IsOptional()
  pyruvicAcid?: number;

  @ApiPropertyOptional({ description: '31. Citric acid (mmol/l)' })
  @IsNumber()
  @IsOptional()
  citricAcid?: number;

  @ApiPropertyOptional({ description: '32. Carotene (mcmol/l)' })
  @IsNumber()
  @IsOptional()
  carotene?: number;

  @ApiPropertyOptional({ description: '33. Vitamin A (mcmol/l)' })
  @IsNumber()
  @IsOptional()
  vitaminA?: number;

  @ApiPropertyOptional({ description: '34. Vitamin C (mcmol/l)' })
  @IsNumber()
  @IsOptional()
  vitaminC?: number;

  @ApiPropertyOptional({ description: '35. Total phosphorus (mmol/l)' })
  @IsNumber()
  @IsOptional()
  organicPhosphorus?: number;

  @ApiPropertyOptional({ description: '36. Total calcium (mmol/l)' })
  @IsNumber()
  @IsOptional()
  totalCalcium?: number;

  @ApiPropertyOptional({ description: '37. Creatine (mmol/l)' })
  @IsNumber()
  @IsOptional()
  creatine?: number;

  @ApiPropertyOptional({ description: '38. Copper (mmol/l)' })
  @IsNumber()
  @IsOptional()
  copper?: number;

  @ApiPropertyOptional({ description: '39. Zinc (mmol/l)' })
  @IsNumber()
  @IsOptional()
  zinc?: number;

  @ApiPropertyOptional({ description: '40. Manganese (mmol/l)' })
  @IsNumber()
  @IsOptional()
  manganese?: number;

  @ApiPropertyOptional({ description: '41. Cobalt (mmol/l)' })
  @IsNumber()
  @IsOptional()
  cobalt?: number;

  // ── Urine (42-57) ──
  @ApiPropertyOptional({ description: '42. Urine color (numeric label)' })
  @IsNumber()
  @IsOptional()
  urineColor?: number;

  @ApiPropertyOptional({ description: '43. Urine smell (numeric label)' })
  @IsNumber()
  @IsOptional()
  urineSmell?: number;

  @ApiPropertyOptional({ description: '44. Urine clarity (numeric label)' })
  @IsNumber()
  @IsOptional()
  urineClarity?: number;

  @ApiPropertyOptional({ description: '45. Urine consistency (numeric label)' })
  @IsNumber()
  @IsOptional()
  urineConsistency?: number;

  @ApiPropertyOptional({ description: '46. Urine pH' })
  @IsNumber()
  @IsOptional()
  urinePh?: number;

  @ApiPropertyOptional({ description: '47. Ketone bodies / acetone (mmol/l)' })
  @IsNumber()
  @IsOptional()
  urineAcetone?: number;

  @ApiPropertyOptional({ description: '48. Protein (g/l)' })
  @IsNumber()
  @IsOptional()
  urineProtein?: number;

  @ApiPropertyOptional({ description: '49. Bilirubin (mcmol/l)' })
  @IsNumber()
  @IsOptional()
  urineBilirubin?: number;

  @ApiPropertyOptional({ description: '50. Urobilinogen (mcmol/l)' })
  @IsNumber()
  @IsOptional()
  urineUrobilinogen?: number;

  @ApiPropertyOptional({ description: '51. Sugar (mmol/l)' })
  @IsNumber()
  @IsOptional()
  urineSugar?: number;

  @ApiPropertyOptional({ description: '52. Leukocytes (count)' })
  @IsNumber()
  @IsOptional()
  urineLeukocytes?: number;

  @ApiPropertyOptional({ description: '53. Epithelium (count)' })
  @IsNumber()
  @IsOptional()
  urineEpithelium?: number;

  @ApiPropertyOptional({ description: '54. Microbial bodies (numeric label)' })
  @IsNumber()
  @IsOptional()
  urineMicrobialBodies?: number;

  @ApiPropertyOptional({ description: '55. Erythrocytes (count)' })
  @IsNumber()
  @IsOptional()
  urineErythrocytes?: number;

  @ApiPropertyOptional({ description: '56. Salt crystals (numeric label)' })
  @IsNumber()
  @IsOptional()
  urineSaltCrystals?: number;

  @ApiPropertyOptional({ description: '57. Amount (l/day)' })
  @IsNumber()
  @IsOptional()
  urineAmount?: number;

  // ── Feces (58-63) ──
  @ApiPropertyOptional({ description: '58. Feces smell (numeric label)' })
  @IsNumber()
  @IsOptional()
  fecesSmell?: number;

  @ApiPropertyOptional({ description: '59. Feces color (numeric label)' })
  @IsNumber()
  @IsOptional()
  fecesColor?: number;

  @ApiPropertyOptional({ description: '60. Feces consistency (numeric label)' })
  @IsNumber()
  @IsOptional()
  fecesConsistency?: number;

  @ApiPropertyOptional({ description: '61. Feces form (numeric label)' })
  @IsNumber()
  @IsOptional()
  fecesForm?: number;

  @ApiPropertyOptional({ description: '62. Feces amount (kg)' })
  @IsNumber()
  @IsOptional()
  fecesAmount?: number;

  @ApiPropertyOptional({ description: '63. Undigested food (%)' })
  @IsNumber()
  @IsOptional()
  fecesUndigestedFood?: number;

  // ── Mucosa (64-67) ──
  @ApiPropertyOptional({ description: '64. Oral mucosa (numeric label)' })
  @IsNumber()
  @IsOptional()
  mucosaOral?: number;

  @ApiPropertyOptional({ description: '65. Nasal mucosa (numeric label)' })
  @IsNumber()
  @IsOptional()
  mucosaNasal?: number;

  @ApiPropertyOptional({ description: '66. Ocular mucosa (numeric label)' })
  @IsNumber()
  @IsOptional()
  mucosaOcular?: number;

  @ApiPropertyOptional({ description: '67. Vaginal mucosa (numeric label)' })
  @IsNumber()
  @IsOptional()
  mucosaVaginal?: number;

  // ── Clinical observations (68-85) ──
  @ApiPropertyOptional({ description: '68. Rumination (chewing)' })
  @IsNumber()
  @IsOptional()
  rumination?: number;

  @ApiPropertyOptional({
    description: '69. Obesity / excess weight (numeric label)',
  })
  @IsNumber()
  @IsOptional()
  obesity?: number;

  @ApiPropertyOptional({ description: '70. Body condition (numeric label)' })
  @IsNumber()
  @IsOptional()
  bodyType?: number;

  @ApiPropertyOptional({ description: '71. Body position (numeric label)' })
  @IsNumber()
  @IsOptional()
  bodyPosition?: number;

  @ApiPropertyOptional({
    description: '72. Wool / hair condition (numeric label)',
  })
  @IsNumber()
  @IsOptional()
  wool?: number;

  @ApiPropertyOptional({ description: '73. Skin color (numeric label)' })
  @IsNumber()
  @IsOptional()
  skinColor?: number;

  @ApiPropertyOptional({ description: '74. Skin humidity (numeric label)' })
  @IsNumber()
  @IsOptional()
  skinHumidity?: number;

  @ApiPropertyOptional({ description: '75. Skin smell (numeric label)' })
  @IsNumber()
  @IsOptional()
  skinSmell?: number;

  @ApiPropertyOptional({ description: '76. Skin temperature (numeric label)' })
  @IsNumber()
  @IsOptional()
  skinTemp?: number;

  @ApiPropertyOptional({ description: '77. Skin surface (numeric label)' })
  @IsNumber()
  @IsOptional()
  skinSurface?: number;

  @ApiPropertyOptional({ description: '78. Skin elasticity (numeric label)' })
  @IsNumber()
  @IsOptional()
  skinElasticity?: number;

  @ApiPropertyOptional({ description: 'Skin sensitivity (numeric label)' })
  @IsNumber()
  @IsOptional()
  skinSensitivity?: number;

  @ApiPropertyOptional({ description: 'Skin pain (numeric label)' })
  @IsNumber()
  @IsOptional()
  skinPainValue?: number;

  @ApiPropertyOptional({ description: 'Rumen fluid state (numeric label)' })
  @IsNumber()
  @IsOptional()
  rumenFluidState?: number;

  @ApiPropertyOptional({ description: '79. Lymph node size (numeric label)' })
  @IsNumber()
  @IsOptional()
  lymphSize?: number;

  @ApiPropertyOptional({ description: '80. Lymph node shape (numeric label)' })
  @IsNumber()
  @IsOptional()
  lymphShape?: number;

  @ApiPropertyOptional({
    description: '81. Lymph node surface (numeric label)',
  })
  @IsNumber()
  @IsOptional()
  lymphSurface?: number;

  @ApiPropertyOptional({
    description: '82. Lymph node consistency (numeric label)',
  })
  @IsNumber()
  @IsOptional()
  lymphConsistency?: number;

  @ApiPropertyOptional({
    description: '83. Lymph node temperature (numeric label)',
  })
  @IsNumber()
  @IsOptional()
  lymphTemp?: number;

  @ApiPropertyOptional({ description: '84. Lymph node pain (numeric label)' })
  @IsNumber()
  @IsOptional()
  lymphPain?: number;

  @ApiPropertyOptional({
    description: '85. Lymph node mobility (numeric label)',
  })
  @IsNumber()
  @IsOptional()
  lymphMobility?: number;
}
