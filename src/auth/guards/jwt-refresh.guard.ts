import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';

import bcrypt from 'bcrypt';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { refreshToken, email } = request.body; // Получаем refresh токен и email из тела запроса

    if (!refreshToken || !email) {
      throw new UnauthorizedException('Refresh token or email is missing');
    }
    try {
      await this.jwtService.verifyAsync(refreshToken); // Декодируем и проверяем токен
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('User not found or no refresh token stored');
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    request.user = user;
    return true;
  }
}
