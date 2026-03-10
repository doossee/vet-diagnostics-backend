import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateMucosaAppearanceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the mucosa appearance in Russian',
    example: 'Бледный',
    type: String,
  })
  readonly name_ru: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the mucosa appearance in Uzbek',
    example: 'Oqargan',
    type: String,
  })
  readonly name_uz: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Numeric value for ML mapping',
    example: 1,
    type: Number,
  })
  readonly numericValue: number;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Mucosa type ID',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
    format: 'uuid',
  })
  readonly mucosaTypeId: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Animal type ID',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
    format: 'uuid',
  })
  readonly animalTypeId: string;
}
