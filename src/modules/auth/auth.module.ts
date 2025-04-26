import { Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthCF, authConfigurations } from '@m-config/configurations/auth.cf';
import { MConfigModule } from '@m-config/m-config.module';
import { MConfigService } from '@m-config/services/config.service';
import { PrismaModule } from '@prisma/prisma.module';

import { AdminController } from './controllers/admin.controller';
import { AuthController } from './controllers/auth.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { AdminService } from './services/admin.service';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    PrismaModule,
    MConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [MConfigModule],

      useFactory: async (configService: MConfigService) => {
        const authConfig = await configService.getConfig(authConfigurations);
        return {
          secret: authConfig.jwtToken,
          signOptions: {
            expiresIn: `${authConfig.accessTokenExpireIN}s`,
          },
        };
      },
      inject: [MConfigService],
    }),
  ],
  controllers: [AuthController, AdminController],
  providers: [
    AuthService,
    AdminService,
    LocalStrategy,
    JwtStrategy,
    Reflector,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: 'JWT_SECRET',
      useFactory: async (configService: MConfigService) => {
        const authConfig = await configService.getConfig(authConfigurations);
        return authConfig.jwtToken;
      },
      inject: [MConfigService],
    },
  ],
  exports: [AuthService, AdminService],
})
export class AuthModule {}
