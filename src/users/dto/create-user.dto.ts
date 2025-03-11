import { IsString, IsEmail, IsOptional } from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email пользователя' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePass123!', description: 'Пароль пользователя', minLength: 6 })
  @IsString()
  password: string;

  @ApiProperty({
    example: UserRole.USER,
    description: 'Роль пользователя (по умолчанию USER)',
    enum: UserRole,
    required: false
  })
  @IsOptional()
  @IsString()
  role: UserRole = UserRole.USER;
}
