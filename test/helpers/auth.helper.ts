import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '../src/generated/prisma/client';

export class AuthTestHelper {
  private jwtService: JwtService;

  constructor() {
    this.jwtService = new JwtService({
      secret: process.env.JWT_SECRET || 'test-secret',
    });
  }

  generateAccessToken(user: Partial<User>): string {
    return this.jwtService.sign({
      userId: user.id,
      username: user.username,
      role: user.role,
    });
  }

  generateRefreshToken(user: Partial<User>): string {
    return this.jwtService.sign(
      {
        userId: user.id,
        username: user.username,
      },
      { expiresIn: '7d' },
    );
  }

  createMockUser(overrides?: Partial<User>): User {
    return {
      id: overrides?.id || 'test-user-id',
      username: overrides?.username || 'testuser',
      password: overrides?.password || 'hashedpassword',
      firstName: overrides?.firstName || 'Test',
      lastName: overrides?.lastName || 'User',
      email: overrides?.email || 'test@example.com',
      phone: overrides?.phone || '+998901234567',
      avatar: overrides?.avatar || null,
      gender: overrides?.gender || null,
      birthDate: overrides?.birthDate || null,
      address: overrides?.address || null,
      role: overrides?.role || UserRole.VETERINARIAN,
      districtId: overrides?.districtId || 'test-district-id',
      refreshTokenHash: overrides?.refreshTokenHash || null,
      tokenExpiresAt: overrides?.tokenExpiresAt || null,
      isActive: overrides?.isActive ?? true,
      createdAt: overrides?.createdAt || new Date(),
      updatedAt: overrides?.updatedAt || new Date(),
      deletedAt: overrides?.deletedAt || null,
    };
  }
}
