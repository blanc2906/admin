import { AuthModule } from '@src/modules/auth/auth.module';
import { BrandModule } from '@src/modules/brand/brand.module';
import { EstateModule } from '@src/modules/estate/estate.module';
import { FeatureModule } from '@src/modules/feature/feature.module';
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@prisma/prisma.module';
import { SyncModule } from '@sync/sync.module';
import { MConfigModule } from '@m-config/m-config.module';
import appConfig from '@shared/config/app.config';
import { MConfigService } from '@m-config/services/config.service';
import { UserModule } from './modules/user/user.module';
import { YoolifeModule } from './modules/yoolife/yoolife.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig
      ],
      envFilePath: ['.env', '.env.development', '.env.production'],
    }),
    MConfigModule.forRoot(),
    PrismaModule,
    AuthModule,
    BrandModule,
    EstateModule,
    SyncModule,
    FeatureModule,
    UserModule,
    YoolifeModule,
  ],
  controllers: [],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly mConfigService: MConfigService) {}

  async onModuleInit() {
    await this.mConfigService.loadAllConfigs();
  }
}
