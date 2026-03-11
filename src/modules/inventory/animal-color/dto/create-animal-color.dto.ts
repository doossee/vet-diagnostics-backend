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
  readonly nameRu: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the color in Uzbek',
    example: 'Oq',
    type: String,
  })
  readonly nameUz: string;
}
