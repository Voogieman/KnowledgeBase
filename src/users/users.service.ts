import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';  // Импортируем User и UserRole для правильной типизации
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateFields: Partial<User> = {};

    if (updateUserDto.email) {
      updateFields.email = updateUserDto.email;
    }
    if (updateUserDto.role) {
      updateFields.role = updateUserDto.role;
    }

    if (Object.keys(updateFields).length === 0) {
      throw new ConflictException('No valid fields to update');
    }

    await this.usersRepository.update(id, updateFields);

    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.remove(user);
  }

  async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.usersRepository.update(userId, { refreshToken });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
}
