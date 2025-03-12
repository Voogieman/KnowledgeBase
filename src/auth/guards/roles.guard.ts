import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // Если роли не заданы, пропускаем
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('RolesGuard: Проверяем пользователя:', user);

    if (!user) {
      console.log('RolesGuard: Пользователь не найден в запросе');
      throw new ForbiddenException('User not authenticated');
    }

    if (!user.role) {
      console.log('RolesGuard: Роль пользователя отсутствует');
      throw new ForbiddenException('User role not found');
    }

    if (!requiredRoles.includes(user.role)) {
      console.log(`RolesGuard: Доступ запрещен. Требуемые роли: ${requiredRoles}, У пользователя: ${user.role}`);
      throw new ForbiddenException('Access denied');
    }

    console.log('RolesGuard: Доступ разрешен');
    return true;
  }
}
