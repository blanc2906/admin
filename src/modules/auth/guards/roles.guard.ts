import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { ROLES_KEY } from '@auth/decorators/roles.decorator';
import { AdminRole } from '@prisma/client';
import { Observable } from 'rxjs';

import { CForbiddenException } from '@shared/exception/http.exception';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AdminRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new CForbiddenException('RolesGuard', 'User not found');
    }

    if (user.role == AdminRole.SUPER_ADMIN) {
      return true;
    }
    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      throw new CForbiddenException('RolesGuard', 'User not have permission');
    }

    return true;
  }
}
