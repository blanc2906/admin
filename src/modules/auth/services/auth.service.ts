import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CreateAdminDto } from '@auth/dto/create-admin.dto';
import { LoginDto } from '@auth/dto/login.dto';
import { AdminEntity } from '@auth/entities/admin.entity';
import { PBaseService } from '@base/services/p-base.service';
import { AdminRole, Configuration } from '@prisma/client';
import { PrismaService } from '@prisma/services/prisma.service';
import * as bcrypt from 'bcrypt';
import { emit } from 'process';

import { CConflictException } from '@shared/exception/http.exception';

@Injectable()
export class AuthService extends PBaseService<Configuration> {
  constructor(
    protected prisma: PrismaService,
    private jwtService: JwtService,
  ) {
    super(prisma.adminAccount);
  }

  async validateAdmin(email: string, password: string) {
    const admin = await this.prisma.adminAccount.findFirst({
      where: {
        email,
        active: true,
      },
    });

    if (!admin) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return null;
    }
    return new AdminEntity(admin);
  }

  async login(loginDto: LoginDto) {
    const admin = await this.validateAdmin(loginDto.email, loginDto.password);
    if (!admin) {
      throw new UnauthorizedException(
        'AuthService.login',
        'Email or password is incorrect',
      );
    }

    const payload = { sub: admin.id, email: admin.email, role: admin.role };
    return {
      accessToken: this.jwtService.sign(payload),
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    };
  }
}
