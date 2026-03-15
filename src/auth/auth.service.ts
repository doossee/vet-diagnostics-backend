import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { compare } from 'bcryptjs';
import { createHash } from 'crypto';
import { UserRole } from 'src/generated/prisma/client';

import { PrismaService } from 'src/core/prisma/prisma.service';
import { UsersService } from './users/users.service';
import { AuthEntity } from './entities';
import { LoginDto } from './dto';
import { JwtPayload } from './types';
import { UserEntity } from './users/entity/user.entity';

/**
 * Authentication Service
 *
 * Implements secure token-based authentication with:
 * - Short-lived access tokens (15 minutes)
 * - Long-lived refresh tokens (7 days)
 * - Automatic token rotation on refresh
 * - SHA256 token hashing for secure storage
 *
 * Supports two authentication flows:
 * 1. Staff Authentication: Username/password → JWT tokens
 * 2. Device Authentication: One-time activation token → JWT tokens
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  // ============================================================================
  // PUBLIC METHODS
  // ============================================================================

  /**
   * Authenticate staff user with username and password
   */
  async login(data: LoginDto): Promise<AuthEntity> {
    const user = await this.validateUserCredentials(
      data.username,
      data.password,
    );

    const payload = this.createJwtPayload(user.id, user.username, user.role);
    const tokens = await this.generateTokenPair(payload);

    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      userId: user.id,
      role: user.role,
    };
  }

  /**
   * Refresh JWT tokens with automatic rotation
   */
  async refresh(refreshToken: string): Promise<AuthEntity> {
    const payload = await this.verifyRefreshToken(refreshToken);
    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User account not found');
    }

    this.validateUserAccount(user);
    this.validateStoredRefreshToken(user, refreshToken);

    const newPayload = this.createJwtPayload(user.id, user.username, user.role);

    const tokens = await this.generateTokenPair(newPayload);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      userId: user.id,
      role: user.role,
    };
  }

  /**
   * Logout user by clearing refresh token
   */
  async logout(refreshToken: string): Promise<void> {
    if (!refreshToken) return;

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        },
      );

      if (payload.sub) {
        await this.clearRefreshToken(payload.sub);
      }
    } catch {
      // Token invalid or expired, nothing to do
      return;
    }
  }

  /**
   * Logout user from all devices
   */
  async logoutAll(userId: string): Promise<void> {
    await this.clearRefreshToken(userId);
  }

  // ============================================================================
  // VALIDATION METHODS
  // ============================================================================

  /**
   * Validate user credentials (username and password)
   */
  private async validateUserCredentials(
    username: string,
    password: string,
  ): Promise<UserEntity> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials. Please check your username and password.',
      );
    }

    this.validateUserAccount(user);

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Invalid credentials. Please check your username and password.',
      );
    }

    return user;
  }

  /**
   * Validate user account status (active and not deleted)
   */
  private validateUserAccount(user: UserEntity): UserEntity {
    if (!user.isActive) {
      throw new UnauthorizedException(
        'Your account has been disabled. Please contact an administrator.',
      );
    }

    if (user.deletedAt) {
      throw new UnauthorizedException(
        'Your account has been deleted. Please contact an administrator.',
      );
    }

    return user;
  }

  /**
   * Validate stored refresh token matches the provided token
   */
  private validateStoredRefreshToken(
    user: UserEntity,
    refreshToken: string,
  ): void {
    const tokenHash = this.hashToken(refreshToken);

    if (user.refreshTokenHash !== tokenHash) {
      throw new UnauthorizedException(
        'Invalid refresh token. Please sign in again.',
      );
    }
  }

  // ============================================================================
  // TOKEN OPERATIONS
  // ============================================================================

  /**
   * Verify refresh token and return decoded payload
   */
  private async verifyRefreshToken(refreshToken: string): Promise<JwtPayload> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    try {
      return await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException(
        'Invalid or expired refresh token. Please sign in again.',
      );
    }
  }

  /**
   * Create JWT payload structure
   */
  private createJwtPayload(
    userId: string,
    username: string,
    role: UserRole,
  ): JwtPayload {
    return {
      sub: userId,
      username,
      role,
    };
  }

  /**
   * Generate access and refresh token pair
   */
  private async generateTokenPair(payload: JwtPayload): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(payload, 'JWT_ACCESS_SECRET', 'JWT_ACCESS_EXPIRE'),
      this.generateToken(payload, 'JWT_REFRESH_SECRET', 'JWT_REFRESH_EXPIRE'),
    ]);

    return { accessToken, refreshToken };
  }

  /**
   * Generate a JWT token with specified secret and expiration
   */
  private generateToken(
    payload: JwtPayload,
    secretKey: string,
    expirationKey: string,
  ): Promise<string> {
    const secret = this.configService.get<string>(secretKey);
    const expiresIn = this.configService.get<string>(expirationKey);

    if (!secret || !expiresIn) {
      throw new Error(
        `Missing JWT configuration: ${secretKey} or ${expirationKey}. Please check your .env file.`,
      );
    }

    return this.jwtService.signAsync(payload, {
      secret,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      expiresIn: expiresIn as any,
    });
  }

  /**
   * Hash token using SHA256
   */
  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  /**
   * Store refresh token hash in user record
   */
  private async storeRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const tokenHash = this.hashToken(refreshToken);
    const expiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRE',
      '7d',
    );

    const ttlSeconds = this.parseExpirationToSeconds(expiresIn);
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshTokenHash: tokenHash,
        tokenExpiresAt: expiresAt,
      },
    });
  }

  /**
   * Clear refresh token from user record
   */
  private async clearRefreshToken(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshTokenHash: null,
        tokenExpiresAt: null,
      },
    });
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Parse JWT expiration string to seconds
   */
  private parseExpirationToSeconds(expiration: string): number {
    const regex = /^(\d+)([smhd])$/;
    const match = expiration.match(regex);

    if (!match) {
      throw new Error(`Invalid expiration format: ${expiration}`);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    const multipliers = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
    };

    return value * (multipliers[unit as keyof typeof multipliers] || 0);
  }
}
