import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JsonWebTokenError, TokenExpiredError, verify } from 'jsonwebtoken';
import 'dotenv/config';
import { jwtPayload } from 'src/users/types/jwtPayload.type';
import { UserRole } from '../enums/UserRole.enum';
import { GUARD_KEY, HEADER_NAME, ROLE_KEY } from '../constants';

@Injectable()
export default class GlobalGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const isPublicRoute = this.reflector.get(GUARD_KEY, context.getHandler());
      if (isPublicRoute) return true;

      const request = context.switchToHttp().getRequest();
      const jwt = request.headers[HEADER_NAME]?.split(' ')[1];

      if (!jwt)
        throw new HttpException('Token missing', HttpStatus.UNAUTHORIZED);

      const canAccess = this.reflector.getAllAndMerge<UserRole[]>(ROLE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error('JWT_SECRET is not defined');
}


      const user = verify(jwt, secret, {}) as jwtPayload;
      const isAuthorized = canAccess.some((role) => role === user.role);

      if (isAuthorized) return true;
      throw new HttpException(
        'Not authorized to call this endpoint',
        HttpStatus.FORBIDDEN,
      );
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
      } else if (error instanceof JsonWebTokenError) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      } else {
        throw error;
      }
    }
  }
}
