import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
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
} from 'src/shared/enums';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateClinicalExamDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  animalId: string;

  @ApiPropertyOptional({ example: 80 })
  @IsNumber()
  @IsOptional()
  pulse?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsNumber()
  @IsOptional()
  rumination?: number;

  @ApiPropertyOptional({ example: 38.5 })
  @IsNumber()
  @IsOptional()
  temperature?: number;

  @ApiPropertyOptional({ example: 20 })
  @IsNumber()
  @IsOptional()
  respiratoryRate?: number;

  @ApiPropertyOptional({ enum: BodyType })
  @IsEnum(BodyType)
  @IsOptional()
  bodyType?: BodyType;

  @ApiPropertyOptional({ enum: ObesityType })
  @IsEnum(ObesityType)
  @IsOptional()
  obesity?: ObesityType;

  @ApiPropertyOptional({ enum: BodyPosition })
  @IsEnum(BodyPosition)
  @IsOptional()
  bodyPosition?: BodyPosition;

  @ApiPropertyOptional({ enum: Constitution })
  @IsEnum(Constitution)
  @IsOptional()
  constitution?: Constitution;

  @ApiPropertyOptional({ enum: Temperament })
  @IsEnum(Temperament)
  @IsOptional()
  temperament?: Temperament;

  @ApiPropertyOptional({ enum: WoolType })
  @IsEnum(WoolType)
  @IsOptional()
  wool?: WoolType;

  @ApiPropertyOptional({ enum: DownType })
  @IsEnum(DownType)
  @IsOptional()
  down?: DownType;

  @ApiPropertyOptional({ enum: HairType })
  @IsEnum(HairType)
  @IsOptional()
  hair?: HairType;

  @ApiPropertyOptional({ enum: FeatherType })
  @IsEnum(FeatherType)
  @IsOptional()
  feathers?: FeatherType;

  @ApiPropertyOptional({ enum: SkinColor })
  @IsEnum(SkinColor)
  @IsOptional()
  skinColor?: SkinColor;

  @ApiPropertyOptional({ enum: SkinHumidity })
  @IsEnum(SkinHumidity)
  @IsOptional()
  skinHumidity?: SkinHumidity;

  @ApiPropertyOptional({ example: 'Normal' })
  @IsString()
  @IsOptional()
  skinSmell?: string;

  @ApiPropertyOptional({ enum: SkinTemp })
  @IsEnum(SkinTemp)
  @IsOptional()
  skinTemp?: SkinTemp;

  @ApiPropertyOptional({ example: 'Smooth' })
  @IsString()
  @IsOptional()
  skinSurface?: string;

  @ApiPropertyOptional({ enum: SkinElasticity })
  @IsEnum(SkinElasticity)
  @IsOptional()
  skinElasticity?: SkinElasticity;

  @ApiPropertyOptional({ example: 'Normal' })
  @IsString()
  @IsOptional()
  skinSensitivity?: string;

  @ApiPropertyOptional({ example: 'None' })
  @IsString()
  @IsOptional()
  skinPain?: string;

  @ApiPropertyOptional({ enum: LymphSize })
  @IsEnum(LymphSize)
  @IsOptional()
  lymphSize?: LymphSize;

  @ApiPropertyOptional({ enum: LymphShape })
  @IsEnum(LymphShape)
  @IsOptional()
  lymphShape?: LymphShape;

  @ApiPropertyOptional({ enum: LymphSurface })
  @IsEnum(LymphSurface)
  @IsOptional()
  lymphSurface?: LymphSurface;

  @ApiPropertyOptional({ enum: LymphConsistency })
  @IsEnum(LymphConsistency)
  @IsOptional()
  lymphConsistency?: LymphConsistency;

  @ApiPropertyOptional({ enum: LymphTemp })
  @IsEnum(LymphTemp)
  @IsOptional()
  lymphTemp?: LymphTemp;

  @ApiPropertyOptional({ enum: LymphPain })
  @IsEnum(LymphPain)
  @IsOptional()
  lymphPain?: LymphPain;

  @ApiPropertyOptional({ enum: LymphMobility })
  @IsEnum(LymphMobility)
  @IsOptional()
  lymphMobility?: LymphMobility;
}
