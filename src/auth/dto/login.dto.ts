import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'professor_xavier' })
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123qazwsx' })
  readonly password: string;
}
