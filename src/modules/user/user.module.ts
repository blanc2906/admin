import { Module } from '@nestjs/common';

import { YoolifeModule } from '../yoolife/yoolife.module';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

@Module({
  imports: [YoolifeModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
