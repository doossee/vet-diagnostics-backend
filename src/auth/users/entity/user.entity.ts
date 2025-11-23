import { ApiProperty } from '@nestjs/swagger';
import { $Enums, User } from '@prisma/client';
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

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Smith',
    required: false,
  })
  lastName: string | null;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.smith@example.com',
    required: false,
  })
  email: string | null;

  @ApiProperty({
    description: "User's phone number",
    example: '+998901234567',
    required: false,
  })
  phone: string | null;

  @ApiProperty({
    description: "User's avatar URL",
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  avatar: string | null;

  @ApiProperty({
    description: "User's gender",
    enum: $Enums.UserGender,
    example: $Enums.UserGender.MALE,
    required: false,
  })
  gender: $Enums.UserGender | null;

  @ApiProperty({
    description: "User's birth date",
    type: String,
    example: '1990-01-01',
    required: false,
  })
  birthDate: Date | null;

  @ApiProperty({
    description: "User's address",
    example: 'Tashkent, Yunusabad district',
    required: false,
  })
  address: string | null;

  @ApiProperty({
    description: "User's role in the system",
    enum: $Enums.UserRole,
    example: $Enums.UserRole.VETERINARIAN,
  })
  role: $Enums.UserRole;

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

  @ApiProperty({
    description: 'Soft delete timestamp',
    type: String,
    example: '2024-01-10T00:00:00.000Z',
    required: false,
  })
  deletedAt: Date | null;
}
