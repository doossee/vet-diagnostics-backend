import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/generated/prisma/client';

export class AuthEntity {
  constructor({ ...data }) {
    Object.assign(this, data);
  }
  @ApiProperty({ readOnly: true })
  accessToken: string;

  @ApiProperty({ readOnly: true })
  refreshToken: string;

  @ApiProperty({ readOnly: true })
  userId?: string;

  @ApiProperty({ readOnly: true })
  role?: UserRole;
}
