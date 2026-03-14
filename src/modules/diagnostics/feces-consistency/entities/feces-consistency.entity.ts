import { ApiProperty } from '@nestjs/swagger';
import { FecesConsistency } from 'src/generated/prisma/client';
import { Expose } from 'class-transformer';

export class FecesConsistencyEntity implements FecesConsistency {
  @ApiProperty({
    description: 'Unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Name in Russian',
    example: 'Плотная',
  })
  @Expose()
  nameRu: string;

  @ApiProperty({
    description: 'Name in Uzbek',
    example: 'Qattiq',
  })
  @Expose()
  nameUz: string;

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
