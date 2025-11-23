/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserRole } from '@prisma/client';

@Injectable()
export class RolesGuard extends JwtAuthGuard implements CanActivate {
  constructor(private requiredRoles: UserRole[]) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      throw new UnauthorizedException('User role is not defined');
    }

    return this.requiredRoles.some((role) => user.role === role);
  }
}
