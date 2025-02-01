import { SetMetadata } from '@nestjs/common';
import { ROLE_KEY } from '../constants';
import { UserRole } from '../enums/UserRole.enum';

export const AllowRoles = (...roles: UserRole[]) =>
  SetMetadata(ROLE_KEY, roles);
