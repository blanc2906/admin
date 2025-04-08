import { CacheModule } from '@nestjs/cache-manager';
import { DynamicModule, Module, OnModuleInit } from '@nestjs/common';
import { MConfigService } from './services/config.service';
import { PrismaService } from '@prisma/services/prisma.service';
@Module({
    imports: [CacheModule.register()],
    providers: [MConfigService, PrismaService],
    exports: [MConfigService],
})
export class MConfigModule implements OnModuleInit {
    constructor(private readonly mConfigService: MConfigService) { }

    async onModuleInit() {
        await this.mConfigService.loadAllConfigs();
    }
    static forRoot(): DynamicModule {
        return {
            module: MConfigModule,
            global: true,
        };
    }
}
