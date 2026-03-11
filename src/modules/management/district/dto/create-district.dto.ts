import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateDistrictDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the district in Russian',
    example: 'Юнусабад',
    type: String,
  })
  readonly nameRu: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the district in Uzbek',
    example: 'Yunusabad',
    type: String,
  })
  readonly nameUz: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID of the parent region',
    example: 1,
    type: Number,
  })
  readonly regionId: number;
}
