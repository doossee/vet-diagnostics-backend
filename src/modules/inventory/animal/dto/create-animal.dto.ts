import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsInt,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { AnimalSex } from '@prisma/client';

export class CreateAnimalDto {
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ example: '2024-01-15T00:00:00Z' })
  readonly arrivalDate: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ example: 3 })
  readonly age: number;

  @IsEnum(AnimalSex)
  @ApiProperty({ enum: AnimalSex, example: 'FEMALE' })
  readonly sex: AnimalSex;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9' })
  readonly farmerId: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9' })
  readonly animalTypeId: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9' })
  readonly animalBreedId: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9' })
  readonly animalColorId: string;
}
