import { ApiProperty } from '@nestjs/swagger';
import { ProphylaxisType } from 'src/generated/prisma/client';
import { Expose } from 'class-transformer';

export class ProphylaxisItemEntity {
  @ApiProperty({ format: 'uuid' })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Localized name',
    example: { ru: 'Название', uz: 'Nomi' },
  })
  @Expose()
  name: { ru: string; uz: string };

  @ApiProperty({ enum: ProphylaxisType })
  @Expose()
  type: ProphylaxisType;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
