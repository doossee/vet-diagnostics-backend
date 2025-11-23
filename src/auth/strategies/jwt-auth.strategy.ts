import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../types';
import { CurrentUserEntity } from '../users/entity';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>('JWT_ACCESS_SECRET');
    if (!secret) {
      throw new Error(
        'JWT_ACCESS_SECRET is not defined in environment variables',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: false,
    });
  }

  validate(payload: JwtPayload): CurrentUserEntity {
    return new CurrentUserEntity({
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    });
  }
}
