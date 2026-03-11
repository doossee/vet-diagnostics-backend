import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsOptional, Min } from 'class-validator';

export class CreateRegionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the region in Russian',
    example: 'Ташкент',
    type: String,
  })
  readonly nameRu: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the region in Uzbek',
    example: 'Toshkent',
    type: String,
  })
  readonly nameUz: string;
}
