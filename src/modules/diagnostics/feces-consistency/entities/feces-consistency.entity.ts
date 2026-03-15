import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class FecesConsistencyEntity {
  @ApiProperty({
    description: 'Unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Localized name', example: { ru: 'Название', uz: 'Nomi' } })
  @Expose()
  name: { ru: string; uz: string };

  @ApiProperty({
    description: 'Numeric value for ML mapping',
    example: 1,
  })
  @Expose()
  numericValue: number;
  @ApiProperty({
    description: 'Animal Type ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  animalTypeId: string;
}
