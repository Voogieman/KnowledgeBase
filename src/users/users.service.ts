import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.usersRepository.remove(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto, requestUser: User): Promise<User> {
    const userToUpdate = await this.findById(id);

    // Проверяем права доступа
    if (requestUser.role !== UserRole.ADMIN && requestUser.id !== userToUpdate.id) {
      throw new ForbiddenException('Only an admin or the user themselves can update this account');
    }

    let updateFields: Partial<User> = {};

    if (requestUser.role === UserRole.ADMIN) {
      updateFields = await this.updateByAdmin(updateUserDto);
    } else {
      updateFields = await this.updatePasswordByUser(updateUserDto);
    }

    if (Object.keys(updateFields).length === 0) {
      throw new ConflictException('No valid fields to update');
    }

    await this.usersRepository.update(id, updateFields);

    return this.findById(id);
  }


  private async updateByAdmin(updateUserDto: UpdateUserDto): Promise<Partial<User>> {
    const updateFields: Partial<User> = {};

    if (updateUserDto.email) {
      updateFields.email = updateUserDto.email;
    }
    if (updateUserDto.role) {
      updateFields.role = updateUserDto.role;
    }
    if (updateUserDto.password) {
      updateFields.password = await this.hashPassword(updateUserDto.password);
    }

    return updateFields;
  }


  private async updatePasswordByUser(updateUserDto: UpdateUserDto): Promise<Partial<User>> {
    if (!updateUserDto.password) {
      throw new ForbiddenException('Users can only update their password');
    }

    return { password: await this.hashPassword(updateUserDto.password) };
  }

  async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.usersRepository.update(userId, { refreshToken });
  }


  private async hashPassword(password: string): Promise<string> {
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
    return await bcrypt.hash(password, saltRounds);
  }
}
