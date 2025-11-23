import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Prisma, UserRole } from '@prisma/client';

export class CreateUserDto implements Prisma.UserUncheckedCreateInput {
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(255, { message: 'Username must not exceed 255 characters' })
  @IsNotEmpty()
  @ApiProperty({
    description: "The user's username (required, unique)",
    example: 'dr_john_smith',
    minLength: 3,
    maxLength: 255,
  })
  username: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsNotEmpty()
  @ApiProperty({
    description: "The user's password",
    example: 'SecurePassword123!',
    minLength: 6,
  })
  password: string;

  @IsString()
  @MinLength(1, { message: 'First name must be at least 1 character long' })
  @MaxLength(255, { message: 'First name must not exceed 255 characters' })
  @IsNotEmpty()
  @ApiProperty({
    description: "The user's first name",
    example: 'John',
    minLength: 1,
    maxLength: 255,
  })
  firstName: string;

  @IsString()
  @MinLength(1, { message: 'Last name must be at least 1 character long' })
  @MaxLength(255, { message: 'Last name must not exceed 255 characters' })
  @IsOptional()
  @ApiProperty({
    description: "The user's last name",
    example: 'Smith',
    required: false,
    nullable: true,
    minLength: 1,
    maxLength: 255,
  })
  lastName?: string | null | undefined;

  @IsString()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsOptional()
  @ApiProperty({
    description: "The user's email address",
    example: 'john.smith@example.com',
    required: false,
    nullable: true,
  })
  email?: string | null | undefined;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: "The user's phone number",
    example: '+998901234567',
    required: false,
    nullable: true,
  })
  phone?: string | null | undefined;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'District ID where the user is located (required)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  districtId: string;

  @IsEnum(UserRole, {
    message: 'Role must be one of the predefined enum values',
  })
  @IsOptional()
  @ApiProperty({
    description: "The user's role in the system",
    enum: UserRole,
    example: UserRole.VETERINARIAN,
    required: false,
  })
  role?: UserRole | undefined;
}
