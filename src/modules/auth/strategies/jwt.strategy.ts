import { Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { AuthCF } from '@m-config/configurations/auth.cf';
import { MConfigService } from '@m-config/services/config.service';
import { PrismaService } from '@prisma/services/prisma.service';
import { ExtractJwt, Strategy } from 'passport-jwt';

import {
  CConflictException,
  CUnauthorizedException,
} from '@shared/exception/http.exception';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: MConfigService,
    @Inject('JWT_SECRET') private readonly jwtSecret: string,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }
  async validate(payload: any) {
    const admin = await this.prisma.adminAccount.findFirst({
      where: {
        id: payload.sub,
        active: true,
      },
    });
    if (!admin) {
      throw new CUnauthorizedException('Admin not existed');
    }

    return {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    };
  }
}
