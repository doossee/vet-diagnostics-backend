import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsDateString,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { ProphylaxisType } from 'src/shared/enums';

export class CreateProphylaxisDto {
  @IsEnum(ProphylaxisType)
  @IsNotEmpty()
  @ApiProperty({ enum: ProphylaxisType, example: ProphylaxisType.VACCINE })
  readonly type: ProphylaxisType;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9' })
  readonly animalId: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9' })
  readonly itemId: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9' })
  readonly detailId?: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ example: '2024-03-15T00:00:00Z' })
  readonly date: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Vaccination completed successfully' })
  readonly notes?: string;
}
