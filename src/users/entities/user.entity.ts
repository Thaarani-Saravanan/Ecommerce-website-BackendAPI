export class User {}
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { UserRole } from 'src/shared/enums/UserRole.enum';

export class UserEntity {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  username: string;

  @Expose()
  role: UserRole;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

export class UsersEntity {
  @Expose()
  @IsArray()
  @Type(() => UserEntity)
  data: UserEntity[];

  @Expose()
  count: number;
}
