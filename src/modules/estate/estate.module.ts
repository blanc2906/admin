import { Module } from '@nestjs/common';

import { AuthModule } from '@auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { AreaEstateService } from '../area-estate/area-estate.service';
import { EstateController } from './estate.controller';
import { EstateService } from './estate.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [EstateController],
  providers: [EstateService],
  exports: [],
})
export class EstateModule {}
