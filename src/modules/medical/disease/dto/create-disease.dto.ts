import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateDiseaseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Стоматит' })
  readonly name_ru: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Stomatit' })
  readonly name_uz: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9' })
  readonly diseaseCategoryId: string;
}
