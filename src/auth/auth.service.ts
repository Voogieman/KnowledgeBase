import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthTokensDto } from './dto/auth-tokens.dto';
import { LoginDto } from './dto/login.dto';

import * as bcrypt from 'bcrypt';
import { AnalyticsClientService } from '../analytics-client/analytics-client.service';

console.log('AuthService загружен');


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly analyticsClient: AnalyticsClientService
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

    // отправка события
    this.analyticsClient.emitEvent('user.registered', user);

    return safeUser;
  }

  async login(loginDto: LoginDto): Promise<AuthTokensDto> {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async refreshToken(user): Promise<{ access_token: string; refresh_token: string }> {
    const tokens = await this.generateTokens(user);

    // Хешируем новый refresh-токен перед сохранением
    await this.usersService.updateRefreshToken(user.id, await bcrypt.hash(tokens.refresh_token, 10));

    return tokens;
  }

  private async generateTokens(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
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

  public async decodeToken(authHeader?: string): Promise<{ userId?: string; role?: UserRole }> {
    if (!authHeader) {
      return {}; // Если заголовка нет, пользователь неавторизован
    }

    const token = authHeader.replace('Bearer ', '');
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      return { userId: decoded.id, role: decoded.role };
    } catch (err) {
      return {}; // Возвращаем пустой объект, а не выбрасываем исключение
    }
  }
}
