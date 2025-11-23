import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTczMzIzMTAyNCwiZXhwIjoxNzMzODM1ODI0fQ.DNcX3QHIowkFxfw88Nh6pMXJNSqNPlZBYsf6uSW96dk',
  })
  readonly refreshToken: string;
}
