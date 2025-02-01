//users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { jwtPayload } from './types/jwtPayload.type';
import { signinDto } from './dto/signin-user.dto';
import { UserEntity, UsersEntity } from './entities/user.entity';
import { GetUsersDto } from './dto/get-useres.dto';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { AllowRoles } from 'src/shared/decorators/allowRoles.decorator';
import { UserRole } from 'src/shared/enums/UserRole.enum';
import { CurrentUser } from 'src/shared/decorators/current-user.decorators';
import { DisableGuard } from 'src/shared/decorators/disableGuard.decorator';
import { AuthService } from './auth.service';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get('/whoami')
  @Serialize(UserEntity)
  @AllowRoles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ description: 'Get the information of the current user.' })
  async whoAmI(@CurrentUser() data: jwtPayload) {
    const user = await this.usersService.findOne(data._id);
    return user;
  }

  @Post('/signup')
  @ApiOperation({ description: 'Create a new user.' })
  @DisableGuard()
  create(@Body() body: CreateUserDto) {
    return this.authService.signup(body);
  }

  @Post('/signin')
  @ApiOperation({ description: 'Signin a user.' })
  @DisableGuard()
  async signin(@Body() body: signinDto) {
    const user = await this.authService.signin(body.email, body.password);
    return user;
  }

  @Get()
  @Serialize(UserEntity)
  @ApiOperation({ description: 'Find all users.' })
  @AllowRoles(UserRole.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

 

  @Post('/all')
  @Serialize(UsersEntity)
  @ApiOperation({ description: 'Find all users.' })
  @AllowRoles(UserRole.ADMIN)
  findAllAndcount(@Body() body: GetUsersDto) {
    return this.usersService.findAllAndCount(body);
  }
  
  @Get(':id')
  @ApiOperation({ description: 'Find a user by id.' })
  @AllowRoles(UserRole.ADMIN, UserRole.USER)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ description: 'Update a user by id.' })
  @AllowRoles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Delete a user by id.' })
  @AllowRoles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
