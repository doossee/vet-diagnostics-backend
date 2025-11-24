import { ApiProperty } from '@nestjs/swagger';
import { MucosaExam, MucosaType } from '@prisma/client';
import { Expose } from 'class-transformer';

export class MucosaExamEntity implements MucosaExam {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @Expose()
  id: string;

  @ApiProperty({ enum: MucosaType })
  @Expose()
  mucosaType: MucosaType;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @Expose()
  animalId: string | null;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @Expose()
  mucosaAppearanceId: string | null;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
