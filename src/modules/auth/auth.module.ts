
import { Module } from '@nestjs/common';
import { SampleService } from './services/sample.service';
import { PrismaModule } from '@prisma/prisma.module';
import { SampleController } from './controllers/sample.controller';
@Module({
  imports: [PrismaModule],
  controllers: [SampleController],
  providers: [SampleService],
  exports: [SampleService],
})
export class AuthModule {}
