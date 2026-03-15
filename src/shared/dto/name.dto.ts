import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NameDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Название', description: 'Name in Russian' })
  ru: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Nomi', description: 'Name in Uzbek' })
  uz: string;
}
