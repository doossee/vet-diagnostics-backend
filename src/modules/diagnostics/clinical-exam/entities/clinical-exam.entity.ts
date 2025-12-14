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
  animalId: string;

  @ApiProperty({ description: 'Pulse', example: 80, required: false })
  @Expose()
  pulse: number | null;

  @ApiProperty({ description: 'Rumination', example: 5, required: false })
  @Expose()
  rumination: number | null;

  @ApiProperty({ description: 'Temperature', example: 38.5, required: false })
  @Expose()
  temperature: number | null;

  @ApiProperty({
    description: 'Respiratory Rate',
    example: 20,
    required: false,
  })
  @Expose()
  respiratoryRate: number | null;

  @ApiProperty({ description: 'Body Type', enum: BodyType, required: false })
  @Expose()
  bodyType: BodyType | null;

  @ApiProperty({ description: 'Obesity', enum: ObesityType, required: false })
  @Expose()
  obesity: ObesityType | null;

  @ApiProperty({
    description: 'Body Position',
    enum: BodyPosition,
    required: false,
  })
  @Expose()
  bodyPosition: BodyPosition | null;

  @ApiProperty({
    description: 'Constitution',
    enum: Constitution,
    required: false,
  })
  @Expose()
  constitution: Constitution | null;

  @ApiProperty({
    description: 'Temperament',
    enum: Temperament,
    required: false,
  })
  @Expose()
  temperament: Temperament | null;

  @ApiProperty({ description: 'Wool Type', enum: WoolType, required: false })
  @Expose()
  wool: WoolType | null;

  @ApiProperty({ description: 'Down Type', enum: DownType, required: false })
  @Expose()
  down: DownType | null;

  @ApiProperty({ description: 'Hair Type', enum: HairType, required: false })
  @Expose()
  hair: HairType | null;

  @ApiProperty({
    description: 'Feather Type',
    enum: FeatherType,
    required: false,
  })
  @Expose()
  feathers: FeatherType | null;

  @ApiProperty({ description: 'Skin Color', enum: SkinColor, required: false })
  @Expose()
  skinColor: SkinColor | null;

  @ApiProperty({
    description: 'Skin Humidity',
    enum: SkinHumidity,
    required: false,
  })
  @Expose()
  skinHumidity: SkinHumidity | null;

  @ApiProperty({
    description: 'Skin Smell',
    example: 'Normal',
    required: false,
  })
  @Expose()
  skinSmell: string | null;

  @ApiProperty({
    description: 'Skin Temperature',
    enum: SkinTemp,
    required: false,
  })
  @Expose()
  skinTemp: SkinTemp | null;

  @ApiProperty({
    description: 'Skin Surface',
    example: 'Smooth',
    required: false,
  })
  @Expose()
  skinSurface: string | null;

  @ApiProperty({
    description: 'Skin Elasticity',
    enum: SkinElasticity,
    required: false,
  })
  @Expose()
  skinElasticity: SkinElasticity | null;

  @ApiProperty({
    description: 'Skin Sensitivity',
    example: 'Normal',
    required: false,
  })
  @Expose()
  skinSensitivity: string | null;

  @ApiProperty({ description: 'Skin Pain', example: 'None', required: false })
  @Expose()
  skinPain: string | null;

  @ApiProperty({ description: 'Lymph Size', enum: LymphSize, required: false })
  @Expose()
  lymphSize: LymphSize | null;

  @ApiProperty({
    description: 'Lymph Shape',
    enum: LymphShape,
    required: false,
  })
  @Expose()
  lymphShape: LymphShape | null;

  @ApiProperty({
    description: 'Lymph Surface',
    enum: LymphSurface,
    required: false,
  })
  @Expose()
  lymphSurface: LymphSurface | null;

  @ApiProperty({
    description: 'Lymph Consistency',
    enum: LymphConsistency,
    required: false,
  })
  @Expose()
  lymphConsistency: LymphConsistency | null;

  @ApiProperty({
    description: 'Lymph Temperature',
    enum: LymphTemp,
    required: false,
  })
  @Expose()
  lymphTemp: LymphTemp | null;

  @ApiProperty({ description: 'Lymph Pain', enum: LymphPain, required: false })
  @Expose()
  lymphPain: LymphPain | null;

  @ApiProperty({
    description: 'Lymph Mobility',
    enum: LymphMobility,
    required: false,
  })
  @Expose()
  lymphMobility: LymphMobility | null;

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

  rumenFluidState: string | null;

  rumenInfusoriaCount: number | null;
}
