import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsUUID } from 'class-validator';

export class CreateUrineClarityDto {
  @ApiProperty({ example: 'Прозрачная' })
  @IsString()
  nameRu: string;

  @ApiProperty({ example: 'Tiniq' })
  @IsString()
  nameUz: string;

  @ApiProperty({ example: 1, description: 'Numeric value for ML mapping' })
  @IsInt()
  numericValue: number;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  animalTypeId: string;
}

