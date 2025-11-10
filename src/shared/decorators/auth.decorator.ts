import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client'; // Путь к роли UserRole из Prisma (или вашей роли)
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function IsAuthenticated() {
  return applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiUnauthorizedResponse({
      description:
        'Access denied: User is not authenticated. Please log in to continue.',
    }),
  );
}

export function IsAdminUser() {
  return applyDecorators(
    UseGuards(JwtAuthGuard, new RolesGuard([UserRole.ADMIN])),
    ApiUnauthorizedResponse({
      description:
        'Access denied: User is not authenticated. Please log in to access this resource.',
    }),
    ApiForbiddenResponse({
      description:
        'Access denied: Insufficient permissions. Admin privileges are required to perform this action.',
    }),
  );
}

export function IsDeviceUser() {
  return applyDecorators(
    UseGuards(JwtAuthGuard, new RolesGuard([UserRole.DEVICE])),
    ApiUnauthorizedResponse({
      description:
        'Access denied: User is not authenticated. Please log in to access this resource.',
    }),
    ApiForbiddenResponse({
      description:
        'Access denied: Insufficient permissions. Device privileges are required to perform this action.',
    }),
  );
}
