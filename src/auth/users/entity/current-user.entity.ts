import { UserRole } from '@prisma/client';

/**
 * Current authenticated user entity
 * Extracted from JWT token payload
 */
export class CurrentUserEntity {
  constructor(data: CurrentUserEntity) {
    Object.assign(this, data);
  }

  /** User ID (UUID) */
  userId: string;

  /** Username */
  username: string;

  /** User role */
  role: UserRole;
}
