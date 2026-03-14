import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAnimalBreedDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the breed in Russian',
    example: 'Голштинская порода',
    type: String,
  })
  readonly nameRu: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the breed in Uzbek',
    example: 'Holstein',
    type: String,
  })
  readonly nameUz: string;
}
