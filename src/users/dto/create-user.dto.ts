//create-user.dto
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { UserRole } from 'src/shared/enums/UserRole.enum';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty({
    enum: [...Object.values(UserRole)],
  })
  @IsEnum(UserRole)
  role: UserRole;
}
