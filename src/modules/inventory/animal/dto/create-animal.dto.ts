import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsInt,
  IsDateString,
  IsOptional,
  IsString,
  Min,
  Max,
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
  @Min(1900)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Birth year of the animal',
    example: 2022,
  })
  readonly birthYear: number;

  @IsInt()
  @Min(1)
  @Max(12)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Birth month of the animal (1–12, day is ignored)',
    example: 6,
  })
  readonly birthMonth: number;

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'UUID of the animal sex lookup entry (auto-assigned from AnimalType if omitted)',
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
