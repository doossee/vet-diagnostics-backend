import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProphylaxisDetailEntity {
  @ApiProperty({ format: 'uuid' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Localized name', example: { ru: 'Название', uz: 'Nomi' } })
  @Expose()
  name: { ru: string; uz: string };

  @ApiProperty()
  @Expose()
  itemId: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
