import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { jwtPayload } from 'src/users/types/jwtPayload.type';
import { HEADER_NAME } from '../constants';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const jwt = request.headers[HEADER_NAME]?.split(' ')[1];
    if (!jwt) throw new HttpException('Token missing', HttpStatus.UNAUTHORIZED);
    const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error('JWT_SECRET is not defined');
}
    const user = verify(jwt, secret, {}) as jwtPayload;
    return user;
  },
);
