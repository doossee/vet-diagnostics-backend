import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import { UserRole } from '@prisma/client';

// Mock bcrypt module
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let prismaService: PrismaService;

  const mockUsersService = {
    findByUsername: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    signAsync: jest.fn(),
    verify: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, string> = {
        JWT_ACCESS_SECRET: 'test-access-secret',
        JWT_REFRESH_SECRET: 'test-refresh-secret',
        JWT_ACCESS_EXPIRE: '15m',
        JWT_REFRESH_EXPIRE: '7d',
      };
      return config[key];
    }),
  };

  const mockPrismaService = {
    user: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return access and refresh tokens for valid credentials', async () => {
      const bcrypt = require('bcryptjs');

      const loginDto = {
        username: 'testuser',
        password: 'password123',
      };

      const mockUser = {
        id: 'user-id',
        username: 'testuser',
        password: 'hashed-password',
        role: UserRole.VETERINARIAN,
        isActive: true,
        deletedAt: null,
      };

      mockUsersService.findByUsername.mockResolvedValue(mockUser);
      mockJwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');
      mockPrismaService.user.update.mockResolvedValue({});
      bcrypt.compare.mockResolvedValue(true);

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(usersService.findByUsername).toHaveBeenCalledWith('testuser');
    });

    it('should throw UnauthorizedException for invalid username', async () => {
      mockUsersService.findByUsername.mockResolvedValue(null);

      await expect(
        service.login({ username: 'invalid', password: 'password' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const bcrypt = require('bcryptjs');

      const mockUser = {
        id: 'user-id',
        username: 'testuser',
        password: 'hashed-password',
        role: UserRole.VETERINARIAN,
        isActive: true,
      };

      mockUsersService.findByUsername.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        service.login({ username: 'testuser', password: 'wrongpassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for inactive user', async () => {
      const bcrypt = require('bcryptjs');

      const mockUser = {
        id: 'user-id',
        username: 'testuser',
        password: 'hashed-password',
        role: UserRole.VETERINARIAN,
        isActive: false,
      };

      mockUsersService.findByUsername.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      await expect(
        service.login({ username: 'testuser', password: 'password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refresh', () => {
    it('should return new access token for valid refresh token', async () => {
      const mockUser = {
        id: 'user-id',
        username: 'testuser',
        role: UserRole.VETERINARIAN,
        refreshTokenHash: 'hashed-token',
        tokenExpiresAt: new Date(Date.now() + 86400000),
        isActive: true,
        deletedAt: null,
      };

      mockJwtService.verifyAsync.mockResolvedValue({
        sub: 'user-id',
        username: 'testuser',
        role: UserRole.VETERINARIAN,
      });
      mockUsersService.findById.mockResolvedValue(mockUser);
      mockJwtService.signAsync
        .mockResolvedValueOnce('new-access-token')
        .mockResolvedValueOnce('new-refresh-token');
      mockPrismaService.user.update.mockResolvedValue({});

      // Mock the hash function to match
      jest.spyOn(require('crypto'), 'createHash').mockReturnValue({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('hashed-token'),
      } as any);

      const result = await service.refresh('valid-refresh-token');

      expect(result).toHaveProperty('accessToken');
      expect(jwtService.verifyAsync).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      await expect(service.refresh('invalid-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for user not found', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({
        sub: 'user-id',
        username: 'testuser',
        role: UserRole.VETERINARIAN,
      });
      mockUsersService.findById.mockResolvedValue(null);

      await expect(service.refresh('valid-refresh-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    it('should clear refresh token for user', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({ sub: 'user-id' });
      mockPrismaService.user.update.mockResolvedValue({});

      await service.logout('valid-refresh-token');

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-id' },
        data: {
          refreshTokenHash: null,
          tokenExpiresAt: null,
        },
      });
    });
  });
});
