import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from 'src/generated/prisma/client';
import { UserGender, UserRole } from 'src/shared/enums';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  constructor({ ...data }: Partial<UserEntity>) {
    Object.assign(this, data);
  }

  @ApiProperty({
    description: 'Unique identifier of the user',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'User login',
    example: 'dr_john_smith',
  })
  username: string;

  @Exclude()
  password: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
  })
  firstName: string;

  @ApiPropertyOptional({
    description: 'Last name of the user',
    example: 'Smith',
  })
  lastName: string | null;

  @ApiPropertyOptional({
    description: 'Email address of the user',
    example: 'john.smith@example.com',
  })
  email: string | null;

  @ApiPropertyOptional({
    description: "User's phone number",
    example: '+998901234567',
  })
  phone: string | null;

  @ApiPropertyOptional({
    description: "User's avatar URL",
    example: 'https://example.com/avatar.jpg',
  })
  avatar: string | null;

  @ApiPropertyOptional({
    description: "User's gender",
    enum: UserGender,
    example: UserGender.MALE,
  })
  gender: UserGender | null;

  @ApiPropertyOptional({
    description: "User's birth date",
    type: String,
    example: '1990-01-01',
  })
  birthDate: Date | null;

  @ApiPropertyOptional({
    description: "User's address",
    example: 'Tashkent, Yunusabad district',
  })
  address: string | null;

  @ApiProperty({
    description: "User's role in the system",
    enum: UserRole,
    example: UserRole.VETERINARIAN,
  })
  role: UserRole;

  @ApiProperty({
    description: 'District ID where the user is located',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  districtId: string;

  @Exclude()
  refreshTokenHash: string | null;

  @Exclude()
  tokenExpiresAt: Date | null;

  @ApiProperty({
    description: 'User is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Record creation timestamp',
    type: String,
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Record last update timestamp',
    type: String,
    example: '2024-01-10T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Soft delete timestamp',
    type: String,
    example: '2024-01-10T00:00:00.000Z',
  })
  deletedAt: Date | null;
}
