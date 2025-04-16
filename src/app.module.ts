import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MConfigModule } from '@m-config/m-config.module';
import { MConfigService } from '@m-config/services/config.service';
import { PrismaModule } from '@prisma/prisma.module';
import { SyncModule } from '@sync/sync.module';

import appConfig from '@shared/config/app.config';

import { AuthModule } from '@src/modules/auth/auth.module';
import { BrandModule } from '@src/modules/brand/brand.module';
import { EstateModule } from '@src/modules/estate/estate.module';
import { FeatureModule } from '@src/modules/feature/feature.module';

import { AreaEstateModule } from './modules/area-estate/area-estate.module';

import { UserModule } from './modules/user/user.module';
import { YoolifeModule } from './modules/yoolife/yoolife.module';
import { EstateMemberModule } from './modules/estate-member/estate-member.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: ['.env', '.env.development', '.env.production'],
    }),
    MConfigModule.forRoot(),
    PrismaModule,
    AuthModule,
    BrandModule,
    EstateModule,
    AreaEstateModule,
    SyncModule,
    FeatureModule,
    UserModule,
    YoolifeModule,
    EstateMemberModule
  ],
  controllers: [],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly mConfigService: MConfigService) {}

  async onModuleInit() {
    await this.mConfigService.loadAllConfigs();
  }
}
