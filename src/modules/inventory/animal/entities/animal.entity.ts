import { ApiProperty } from '@nestjs/swagger';
import { Animal } from 'src/generated/prisma/client';
import { Expose } from 'class-transformer';

export class AnimalEntity implements Animal {
  @ApiProperty({
    description: 'Unique identifier for the animal',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
    format: 'uuid',
  })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Name of the animal', example: 'Example' })
  @Expose()
  animalNameCode: string;

  @ApiProperty({
    description: 'Date of arrival',
    example: '2024-01-15T00:00:00.000Z',
  })
  @Expose()
  arrivalDate: Date;

  @ApiProperty({ description: 'Birth date (day always = 1, month precision only)', example: '2022-03-01' })
  @Expose()
  birthDate: Date;

  @ApiProperty({
    description: 'ID of the sex lookup entry',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
    required: false,
  })
  @Expose()
  sexId: string | null;

  @ApiProperty({
    description: 'ID of the farmer',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
  })
  @Expose()
  farmerId: string | null;

  @ApiProperty({
    description: 'ID of the animal type',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
  })
  @Expose()
  animalTypeId: string;

  @ApiProperty({
    description: 'ID of the animal breed',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
  })
  @Expose()
  animalBreedId: string;

  @ApiProperty({
    description: 'ID of the animal color',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
  })
  @Expose()
  animalColorId: string;

  @ApiProperty({
    description: 'Record creation timestamp',
    example: '2024-01-15T10:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Record last update timestamp',
    example: '2024-01-15T10:00:00.000Z',
  })
  @Expose()
  updatedAt: Date;
}
