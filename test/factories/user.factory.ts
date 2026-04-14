import { User, UserRole, UserGender } from 'src/generated/prisma/client';
import { getPrismaTestClient } from '../utils/database';
import * as bcrypt from 'bcryptjs';

export class UserFactory {
  private prisma = getPrismaTestClient();

  async create(overrides?: Partial<User>): Promise<User> {
    const hashedPassword = await bcrypt.hash(
      overrides?.password || 'password123',
      10,
    );

    return this.prisma.user.create({
      data: {
        username: overrides?.username || `user_${Date.now()}`,
        password: hashedPassword,
        firstName: overrides?.firstName || 'Test',
        lastName: overrides?.lastName || 'User',
        email: overrides?.email || `test_${Date.now()}@example.com`,
        phone:
          overrides?.phone ||
          `+99890${Math.floor(1000000 + Math.random() * 9000000)}`,
        role: overrides?.role || UserRole.VETERINARIAN,
        districtId: overrides?.districtId || 'test-district-id',
        gender: overrides?.gender || UserGender.MALE,
        isActive: overrides?.isActive ?? true,
      },
    });
  }

  async createMany(count: number, overrides?: Partial<User>): Promise<User[]> {
    const users: User[] = [];
    for (let i = 0; i < count; i++) {
      users.push(
        await this.create({
          ...overrides,
          username: `user_${Date.now()}_${i}`,
          email: `test_${Date.now()}_${i}@example.com`,
        }),
      );
    }
    return users;
  }
}
