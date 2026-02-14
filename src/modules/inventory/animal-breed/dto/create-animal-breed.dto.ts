import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateAnimalBreedDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the breed in Russian',
    example: 'Голштинская порода',
    type: String,
  })
  readonly name_ru: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the breed in Uzbek',
    example: 'Holstein',
    type: String,
  })
  readonly name_uz: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Animal Type ID',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
    format: 'uuid',
  })
  readonly animalTypeId: string;
}
