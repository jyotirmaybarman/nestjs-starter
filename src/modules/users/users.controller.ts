import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UpdateuserDto } from './dtos/update-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/modules/users/entities/users.entity';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { WinstonLogger } from 'src/utils/winston-logger/winston-logger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  private logger = new WinstonLogger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({
    status: 200,
    description: 'Returns list of users',
    type: [User],
  })
  @Get()
  @Serialize(User)
  async getUsers() {
    this.logger.log('Getting all users');
    return await this.usersService.getUsers();
  }

  @ApiResponse({
    status: 200,
    description: 'Returns just one user',
    type: [User],
  })
  @Get('/:id')
  @Serialize(User)
  async getUser(@Param('id') id: string) {
    return await this.usersService.getUser(id);
  }

  @ApiResponse({
    status: 201,
    type: User,
  })
  @Post()
  @Serialize(User)
  async createUser(@Body() data: CreateUserDto) {
    return await this.usersService.createUser(data);
  }

  @Patch('/:id')
  @ApiResponse({ status: 200, type: User })
  @Serialize(User)
  async updateUser(@Param('id') id: string, @Body() data: UpdateuserDto) {
    return await this.usersService.updateUser(id, data);
  }

  @Delete('/:id')
  @Serialize(User)
  @ApiResponse({ status: 200, type: User })
  async deleteUser(@Param('id') id: string) {
    return await this.usersService.removeUser(id);
  }
}
