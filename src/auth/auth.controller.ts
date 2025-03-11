import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthTokensDto } from './dto/auth-tokens.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiResponse({ status: 200, description: 'Успешный вход', type: AuthTokensDto })
  @ApiResponse({ status: 401, description: 'Неверный email или пароль' })
  async login(@Body() loginDto: LoginDto): Promise<AuthTokensDto> {
    return this.authService.login(loginDto);
  }


  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно зарегистрирован' })
  @ApiResponse({ status: 409, description: 'Email уже зарегистрирован' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({ summary: 'Обновление токена доступа' })
  @ApiResponse({ status: 200, description: 'Новый токен доступа', type: AuthTokensDto })
  @ApiResponse({ status: 401, description: 'Неверный refresh-токен' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<AuthTokensDto> {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
