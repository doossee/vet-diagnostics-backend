import { ApiProperty } from '@nestjs/swagger';
import {
  ClinicalExam,
  BodyType,
  ObesityType,
  BodyPosition,
  Constitution,
  Temperament,
  WoolType,
  DownType,
  HairType,
  FeatherType,
  SkinColor,
  SkinHumidity,
  SkinTemp,
  SkinElasticity,
  LymphSize,
  LymphShape,
  LymphSurface,
  LymphConsistency,
  LymphTemp,
  LymphPain,
  LymphMobility,
} from '@prisma/client';
import { Expose } from 'class-transformer';

export class ClinicalExamEntity implements ClinicalExam {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @Expose()
  id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @Expose()
  animalId: string;

  @ApiProperty({ example: 80, required: false })
  @Expose()
  pulse: number | null;

  @ApiProperty({ example: 5, required: false })
  @Expose()
  rumination: number | null;

  @ApiProperty({ example: 38.5, required: false })
  @Expose()
  temperature: number | null;

  @ApiProperty({ example: 20, required: false })
  @Expose()
  respiratoryRate: number | null;

  @ApiProperty({ enum: BodyType, required: false })
  @Expose()
  bodyType: BodyType | null;

  @ApiProperty({ enum: ObesityType, required: false })
  @Expose()
  obesity: ObesityType | null;

  @ApiProperty({ enum: BodyPosition, required: false })
  @Expose()
  bodyPosition: BodyPosition | null;

  @ApiProperty({ enum: Constitution, required: false })
  @Expose()
  constitution: Constitution | null;

  @ApiProperty({ enum: Temperament, required: false })
  @Expose()
  temperament: Temperament | null;

  @ApiProperty({ enum: WoolType, required: false })
  @Expose()
  wool: WoolType | null;

  @ApiProperty({ enum: DownType, required: false })
  @Expose()
  down: DownType | null;

  @ApiProperty({ enum: HairType, required: false })
  @Expose()
  hair: HairType | null;

  @ApiProperty({ enum: FeatherType, required: false })
  @Expose()
  feathers: FeatherType | null;

  @ApiProperty({ enum: SkinColor, required: false })
  @Expose()
  skinColor: SkinColor | null;

  @ApiProperty({ enum: SkinHumidity, required: false })
  @Expose()
  skinHumidity: SkinHumidity | null;

  @ApiProperty({ example: 'Normal', required: false })
  @Expose()
  skinSmell: string | null;

  @ApiProperty({ enum: SkinTemp, required: false })
  @Expose()
  skinTemp: SkinTemp | null;

  @ApiProperty({ example: 'Smooth', required: false })
  @Expose()
  skinSurface: string | null;

  @ApiProperty({ enum: SkinElasticity, required: false })
  @Expose()
  skinElasticity: SkinElasticity | null;

  @ApiProperty({ example: 'Normal', required: false })
  @Expose()
  skinSensitivity: string | null;

  @ApiProperty({ example: 'None', required: false })
  @Expose()
  skinPain: string | null;

  @ApiProperty({ enum: LymphSize, required: false })
  @Expose()
  lymphSize: LymphSize | null;

  @ApiProperty({ enum: LymphShape, required: false })
  @Expose()
  lymphShape: LymphShape | null;

  @ApiProperty({ enum: LymphSurface, required: false })
  @Expose()
  lymphSurface: LymphSurface | null;

  @ApiProperty({ enum: LymphConsistency, required: false })
  @Expose()
  lymphConsistency: LymphConsistency | null;

  @ApiProperty({ enum: LymphTemp, required: false })
  @Expose()
  lymphTemp: LymphTemp | null;

  @ApiProperty({ enum: LymphPain, required: false })
  @Expose()
  lymphPain: LymphPain | null;

  @ApiProperty({ enum: LymphMobility, required: false })
  @Expose()
  lymphMobility: LymphMobility | null;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
