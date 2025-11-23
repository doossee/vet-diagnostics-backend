import { UserRole } from '@prisma/client';

/**
 * JWT Payload Structure
 * Contains essential user authentication data
 */
export type JwtPayload = {
  /** User ID (UUID) */
  sub: string;

  /** Username for identification */
  username: string;

  /** User role (SUPER_ADMIN, ADMIN, VETERINARIAN, FARMER) */
  role: UserRole;
};
