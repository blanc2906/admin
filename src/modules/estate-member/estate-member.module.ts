import { EstateModule } from '@estate/estate.module';
import { Module } from '@nestjs/common';

import { PrismaModule } from '@prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { EstateMemberController } from './estate-member.controller';
import { EstateMemberService } from './estate-member.service';
import { UserService } from '../user/services/user.service';
import { YoolifeModule } from '../yoolife/yoolife.module';


@Module({
  imports: [PrismaModule, EstateModule, UserModule, YoolifeModule],
  controllers: [EstateMemberController],
  providers: [EstateMemberService, UserService],
  exports: [EstateMemberService],
})
export class EstateMemberModule {}
