import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthTokensDto } from './dto/auth-tokens.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto'; // DTO для refresh токена

import * as bcrypt from 'bcrypt';

console.log('AuthService загружен');


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<Omit<User, 'password' | 'refreshToken'>> {
    const { email, password } = createUserDto;

    if (await this.usersService.findByEmail(email)) {
      throw new ConflictException('User with this email already exists');
    }

    if (!password) {
      throw new ConflictException('Password is required');
    }

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // Удаляем пароль и refreshToken перед возвратом
    const { password: _, refreshToken: __, ...safeUser } = user;
    return safeUser;
  }

  async login(loginDto: LoginDto): Promise<AuthTokensDto> {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthTokensDto> {
    const { refreshToken, email } = refreshTokenDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = { email: user.email, sub: user.id }; // Используем user.id как sub для идентификации
    const newAccessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    await this.usersService.updateRefreshToken(user.email, hashedRefreshToken);

    return { access_token: newAccessToken, refresh_token: newRefreshToken };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    console.log('Введенный пароль:', password);
    console.log('Хешированный пароль из БД:', user?.password);

    if (!user) {
      console.log('Пользователь не найден');
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Результат сравнения bcrypt:', isMatch);

    if (!isMatch) {
      console.log('Пароли не совпадают');
      return null;
    }

    return user;
  }

}
