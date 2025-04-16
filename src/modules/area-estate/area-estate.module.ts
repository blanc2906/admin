import { Module } from '@nestjs/common';

import { PrismaModule } from '@prisma/prisma.module';

import { AreaEstateController } from './area-estate.controller';
import { AreaEstateService } from './area-estate.service';

@Module({
  imports: [PrismaModule],
  controllers: [AreaEstateController],
  providers: [AreaEstateService],
  exports: [AreaEstateService],
})
export class AreaEstateModule {}
