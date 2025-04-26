import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { YoolifeAuthenticateService } from './yoolife-authen.service';
import axios, { AxiosResponse } from 'axios';
import { FindAllUserDto } from '@src/modules/user/dto/find-all-user.dto';
import { CreateUserDto } from '@src/modules/user/dto/create-user.dto';
import { YoolifeResponseDto } from '../dto/yoolife-response.dto';

@Injectable()
export class YoolifeUserService {
  constructor(
    private readonly yoolifeAuthService: YoolifeAuthenticateService,
  ) {}

  async findAllUsers(params: FindAllUserDto) {
    try {
      const token = await this.yoolifeAuthService.authenticate();
      
      const res = await axios.get(
        `${this.yoolifeAuthService.YOOLIFE_URL_PATH}/api/services/app/IOTUserManager/GetAll`,
        {
          params: {
            IsActive: params.isActive || true,
            SkipCount: params.skipCount || 0,
            Keyword: params.keyword,
            OrderBy: params.orderBy,
            SortBy: params.sortBy,
          },
          headers: {
            Authorization: `Bearer ${token}`
          },
        },
      );

      return {
        data: res.data.result.data,
        total: res.data.result.totalRecords,
      };
    } catch (error) {
      throw new Error('Get data fail from yoolife');
    }
  }

  async create(body: CreateUserDto) {
    try {
      const token = await this.yoolifeAuthService.authenticate();
      const res: AxiosResponse<YoolifeResponseDto<any>> = await axios.post(
        `${this.yoolifeAuthService.YOOLIFE_URL_PATH}/api/services/app/IOTUserManager/Create`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return res.data.result.success;
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(ids: number[]) {
    try {
      const token = await this.yoolifeAuthService.authenticate();
      const res: AxiosResponse<YoolifeResponseDto<any>> = await axios.delete(
        `${this.yoolifeAuthService.YOOLIFE_URL_PATH}/api/services/app/IOTUserManager/DeleteMultiple`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          data: { ids }
        }
      );
      return res.data.result.success;
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
