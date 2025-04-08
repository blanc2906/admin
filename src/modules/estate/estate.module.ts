import { Module } from '@nestjs/common';

import { AuthModule } from '@auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { AreaEstateController } from './area-estate.controller';
import { AreaEstateService } from './area-estate.service';
import { EstateController } from './estate.controller';
import { EstateService } from './estate.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [EstateController, AreaEstateController],
  providers: [EstateService, AreaEstateService],
  exports: [],
})
export class EstateModule {}
