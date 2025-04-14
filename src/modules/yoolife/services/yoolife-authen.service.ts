import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';

import { MConfigService } from '@m-config/services/config.service';
import axios, { AxiosResponse } from 'axios';

import { CreateUserDto } from '@src/modules/user/dto/create-user.dto';
import { FindAllUserDto } from '@src/modules/user/dto/find-all-user.dto';

import { YoolifeResponseDto } from '../dto/yoolife-response.dto';
import { YoolifeUserResponseDto } from '../dto/yoolife-user-response.dto';

@Injectable()
export class YoolifeAuthenticateService implements OnModuleInit {
  constructor(private readonly mconfigService: MConfigService) {}
  YOOLIFE_URL_PATH: string;
  YOOLIFE_ACCOUNT: string;
  YOOLIFE_PASSWORD: string;

  async onModuleInit() {
    this.YOOLIFE_URL_PATH =
      await this.mconfigService.get<string>('YOOLIFE_URL');
    this.YOOLIFE_ACCOUNT =
      await this.mconfigService.get<string>('YOOLIFE_ACCOUNT');
    this.YOOLIFE_PASSWORD =
      await this.mconfigService.get<string>('YOOLIFE_PASSWORD');
  }

  async authenticate() {
    try {
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  getAccessToken(refreshToken: string) {}
}
