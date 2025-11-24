import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateUrineColorDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the urine color in Russian',
    example: 'Желтый',
    type: String,
  })
  readonly name_ru: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the urine color in Uzbek',
    example: 'Sariq',
    type: String,
  })
  readonly name_uz: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Animal type ID',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
    format: 'uuid',
  })
  readonly animalTypeId: string;
}
