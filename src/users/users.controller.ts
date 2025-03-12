import { Controller, Body, Get, Param, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/decarators/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Получение пользователя по ID (только для админа)' })
  async getUser(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Получение списка всех пользователей (только для админа)' })
  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Обновление данных пользователя (админ может обновлять всё, пользователь — только пароль)' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any
  ): Promise<{ message : string }> {
     return this.usersService.update(id, updateUserDto, req.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Удаление пользователя (только админ)' })
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
