import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUserEntity } from '../users/entity';

export const GetCurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserEntity => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ user: CurrentUserEntity }>();
    return request.user;
  },
);
