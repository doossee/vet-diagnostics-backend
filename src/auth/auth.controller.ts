import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthEntity } from './entities';
import { JwtAuthGuard } from './guards';
import { GetCurrentUser } from './decorators';
import { CurrentUserEntity } from './users/entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'User login',
    description:
      'Authenticates users (SUPER_ADMIN, ADMIN, VETERINARIAN, FARMER) with username and password. Returns JWT access and refresh tokens.',
  })
  @ApiOkResponse({
    type: AuthEntity,
    description: 'Successfully authenticated',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials or account disabled',
  })
  @Post('login')
  async login(@Body() data: LoginDto): Promise<AuthEntity> {
    return await this.authService.login(data);
  }

  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Validates refresh token from Authorization header and issues new access and refresh tokens with token rotation. Old refresh token is automatically replaced. Send refresh token as Bearer token in Authorization header.',
  })
  @ApiOkResponse({
    type: AuthEntity,
    description:
      'Successfully refreshed tokens. New tokens issued, old token replaced.',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid, expired, or revoked refresh token',
  })
  @ApiBearerAuth()
  @Post('refresh')
  async refresh(@Headers('authorization') authorization?: string) {
    if (!authorization) {
      throw new UnauthorizedException('Refresh token is required');
    }

    // Extract token from "Bearer <token>"
    const token = authorization.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException('Invalid token format');
    }

    return new AuthEntity(await this.authService.refresh(token));
  }

  @ApiOperation({
    summary: 'Logout (revoke current refresh token)',
    description:
      'Revokes the current refresh token. Send refresh token as Bearer token in Authorization header.',
  })
  @ApiOkResponse({
    description: 'Successfully logged out',
  })
  @ApiBearerAuth()
  @Post('logout')
  async logout(@Headers('authorization') authorization?: string) {
    if (authorization) {
      const token = authorization.replace('Bearer ', '');
      await this.authService.logout(token);
    }
    return { message: 'Successfully logged out' };
  }

  @ApiOperation({
    summary: 'Logout from all devices',
    description:
      'Revokes all refresh tokens for the authenticated user. This logs out the user from all devices. Requires valid access token.',
  })
  @ApiOkResponse({
    description: 'Successfully logged out from all devices',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired access token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  async logoutAll(@GetCurrentUser() user: CurrentUserEntity) {
    await this.authService.logoutAll(user.userId);
    return { message: 'Successfully logged out from all devices' };
  }
}
