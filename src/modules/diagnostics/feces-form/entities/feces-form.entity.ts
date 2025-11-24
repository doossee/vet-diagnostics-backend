import { ApiProperty } from '@nestjs/swagger';
import { FecesForm } from '@prisma/client';
import { Expose } from 'class-transformer';

export class FecesFormEntity implements FecesForm {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'Оформленный' })
  @Expose()
  name_ru: string;

  @ApiProperty({ example: 'Shakllangan' })
  @Expose()
  name_uz: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @Expose()
  animalTypeId: string;
}
