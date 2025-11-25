import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAnimalColorDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the color in Russian',
    example: 'Белый',
    type: String,
  })
  readonly name_ru: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the color in Uzbek',
    example: 'Oq',
    type: String,
  })
  readonly name_uz: string;
}
