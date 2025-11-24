import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { ProphylaxisType } from '@prisma/client';

export class CreateProphylaxisItemDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Вакцина против бруцеллёза' })
  readonly name_ru: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Brucella vaksina' })
  readonly name_uz: string;

  @IsEnum(ProphylaxisType)
  @ApiProperty({ enum: ProphylaxisType, example: 'VACCINE' })
  readonly type: ProphylaxisType;
}
