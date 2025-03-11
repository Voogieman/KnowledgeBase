import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/decarators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findById(id);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
