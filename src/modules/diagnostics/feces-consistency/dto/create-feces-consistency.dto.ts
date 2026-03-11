import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsUUID } from 'class-validator';

export class CreateFecesConsistencyDto {
  @ApiProperty({ example: 'Плотная' })
  @IsString()
  name_ru: string;

  @ApiProperty({ example: 'Qattiq' })
  @IsString()
  name_uz: string;

  @ApiProperty({ example: 1, description: 'Numeric value for ML mapping' })
  @IsInt()
  numericValue: number;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  animalTypeId: string;
}

