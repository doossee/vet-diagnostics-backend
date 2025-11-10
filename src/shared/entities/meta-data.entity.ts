import { ApiProperty } from '@nestjs/swagger';

export class MetaDataEntity {
  @ApiProperty({ example: 50 })
  total: number;

  @ApiProperty({ example: 5 })
  lastPage: number;

  @ApiProperty({ example: 1 })
  currentPage: number;

  @ApiProperty({ example: 10 })
  perPage: number;

  @ApiProperty({ example: null })
  prev: number | null;

  @ApiProperty({ example: 2 })
  next: number | null;
}
