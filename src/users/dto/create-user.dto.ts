import { IsString, IsEmail, IsOptional } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  role: UserRole = UserRole.USER;
}
