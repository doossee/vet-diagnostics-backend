import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsEnum } from 'class-validator';
import { MucosaType } from 'src/shared/enums';

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

  @IsEnum(MucosaType)
  @IsNotEmpty()
  @ApiProperty({
    enum: MucosaType,
    description: 'Type of mucosa',
    example: MucosaType.ORAL,
  })
  readonly mucosaType: MucosaType;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Animal type ID',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
    format: 'uuid',
  })
  readonly animalTypeId: string;
}
