import { Module } from '@nestjs/common';

import { YoolifeAuthenticateService } from './services/yoolife-authen.service';
import { YoolifeUserService } from './services/yoolife-user.service';

@Module({
  providers: [YoolifeUserService, YoolifeAuthenticateService],
  exports: [YoolifeUserService, YoolifeAuthenticateService],
})
export class YoolifeModule {}
