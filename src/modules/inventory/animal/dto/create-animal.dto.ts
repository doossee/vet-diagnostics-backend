import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsInt,
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAnimalDto {
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Date when the animal arrived',
    example: '2024-01-15T00:00:00Z',
  })
  readonly arrivalDate: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name or Code of the animal',
    example: 'Example',
  })
  readonly animalNameCode: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Age of the animal in months',
    example: 12,
  })
  readonly age: number;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'UUID of the animal sex lookup entry',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
  })
  readonly sexId?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'UUID of the farmer who owns the animal',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
  })
  readonly farmerId: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'UUID of the animal type',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
  })
  readonly animalTypeId: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'UUID of the animal breed',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
  })
  readonly animalBreedId: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'UUID of the animal color',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
  })
  readonly animalColorId: string;
}
