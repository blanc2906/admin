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
export class YoolifeUserService implements OnModuleInit {
  constructor(private readonly mconfigService: MConfigService) {}
  YOOLIFE_URL_PATH: string;

  async onModuleInit() {
    this.YOOLIFE_URL_PATH =
      await this.mconfigService.get<string>('YOOLIFE_URL');
  }

  async findAllUsers(params: FindAllUserDto) {
    try {
      const res: AxiosResponse<YoolifeResponseDto<YoolifeUserResponseDto>> =
        await axios.get(
          `${this.YOOLIFE_URL_PATH}/api/services/app/IOTUserManager/GetAll`,
          {
            params: {
              IsActive: params.isActive,
              SkipCount: params.skipCount,
              MaxResultCount: params.maxResultCount,
              Keyword: params.keyword,
              Ordery: params.sortBy,
              SortBy: params.sortBy,
            },
            headers: {
              Authorization:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJhZG1pbkBpbWF4aGl0ZWNoLmNvbSIsIkFzcE5ldC5JZGVudGl0eS5TZWN1cml0eVN0YW1wIjoiUVRBWUE0QVFYRVdKWDJRQlhIV0RRQ0JJRFVSRDY0WlciLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOlsiQWRtaW4iLCJDaXRpemVuTWFuYWdlciJdLCJzdWIiOiIxIiwianRpIjoiZDVlY2FjZmYtNjI4Yi00ZTgwLTk1YzktMzg3NDQxYTM0YzMxIiwiaWF0IjoxNzQxNTc4MzIwLCJ0b2tlbl92YWxpZGl0eV9rZXkiOiJjYTEwNzliNy00MDlmLTQ3NjktYTU5Yy1kMDQ2YTk5ZDkwZDMiLCJ1c2VyX2lkZW50aWZpZXIiOiIxIiwidG9rZW5fdHlwZSI6IjAiLCJyZWZyZXNoX3Rva2VuX3ZhbGlkaXR5X2tleSI6IjVlYmIyMDlmLWVmZDgtNDYzNi1iOTVjLTZkMmUyNzAwNjZiYiIsInVzZXJfZ2xvYmFsX2lkIjoiMSIsIm5iZiI6MTc0MTU3ODMyMCwiZXhwIjoxNzQ0MjU2NzIwLCJpc3MiOiJZb290ZWsiLCJhdWQiOiJZb290ZWsifQ.DB_77eq_bTMqqYZ4OaGaChxYBUspeo-adgAYn9ZCC5o',
            },
          },
        );

      return {
        data: res.data.result.data,
        total: res.data.result.totalRecords,
      };
    } catch (e) {
      console.error(e);
      throw new HttpException(
        'Get data fail from yoolife',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(body: CreateUserDto) {
    try {
      const res: AxiosResponse<YoolifeResponseDto<any>> = await axios.post(
        `${this.YOOLIFE_URL_PATH}/api/services/app/IOTUserManager/Create`,
        body,
        {
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJhZG1pbkBpbWF4aGl0ZWNoLmNvbSIsIkFzcE5ldC5JZGVudGl0eS5TZWN1cml0eVN0YW1wIjoiUVRBWUE0QVFYRVdKWDJRQlhIV0RRQ0JJRFVSRDY0WlciLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOlsiQWRtaW4iLCJDaXRpemVuTWFuYWdlciJdLCJzdWIiOiIxIiwianRpIjoiZDVlY2FjZmYtNjI4Yi00ZTgwLTk1YzktMzg3NDQxYTM0YzMxIiwiaWF0IjoxNzQxNTc4MzIwLCJ0b2tlbl92YWxpZGl0eV9rZXkiOiJjYTEwNzliNy00MDlmLTQ3NjktYTU5Yy1kMDQ2YTk5ZDkwZDMiLCJ1c2VyX2lkZW50aWZpZXIiOiIxIiwidG9rZW5fdHlwZSI6IjAiLCJyZWZyZXNoX3Rva2VuX3ZhbGlkaXR5X2tleSI6IjVlYmIyMDlmLWVmZDgtNDYzNi1iOTVjLTZkMmUyNzAwNjZiYiIsInVzZXJfZ2xvYmFsX2lkIjoiMSIsIm5iZiI6MTc0MTU3ODMyMCwiZXhwIjoxNzQ0MjU2NzIwLCJpc3MiOiJZb290ZWsiLCJhdWQiOiJZb290ZWsifQ.DB_77eq_bTMqqYZ4OaGaChxYBUspeo-adgAYn9ZCC5o',
          },
        },
      );
      return res.data.result.success;
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(ids: number[]) {
    try {
      const res: AxiosResponse<YoolifeResponseDto<any>> = await axios.delete(
        `${this.YOOLIFE_URL_PATH}/api/services/app/IOTUserManager/DeleteMultiple`,
        {
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJhZG1pbkBpbWF4aGl0ZWNoLmNvbSIsIkFzcE5ldC5JZGVudGl0eS5TZWN1cml0eVN0YW1wIjoiUVRBWUE0QVFYRVdKWDJRQlhIV0RRQ0JJRFVSRDY0WlciLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOlsiQWRtaW4iLCJDaXRpemVuTWFuYWdlciJdLCJzdWIiOiIxIiwianRpIjoiZDVlY2FjZmYtNjI4Yi00ZTgwLTk1YzktMzg3NDQxYTM0YzMxIiwiaWF0IjoxNzQxNTc4MzIwLCJ0b2tlbl92YWxpZGl0eV9rZXkiOiJjYTEwNzliNy00MDlmLTQ3NjktYTU5Yy1kMDQ2YTk5ZDkwZDMiLCJ1c2VyX2lkZW50aWZpZXIiOiIxIiwidG9rZW5fdHlwZSI6IjAiLCJyZWZyZXNoX3Rva2VuX3ZhbGlkaXR5X2tleSI6IjVlYmIyMDlmLWVmZDgtNDYzNi1iOTVjLTZkMmUyNzAwNjZiYiIsInVzZXJfZ2xvYmFsX2lkIjoiMSIsIm5iZiI6MTc0MTU3ODMyMCwiZXhwIjoxNzQ0MjU2NzIwLCJpc3MiOiJZb290ZWsiLCJhdWQiOiJZb290ZWsifQ.DB_77eq_bTMqqYZ4OaGaChxYBUspeo-adgAYn9ZCC5o',
          },
          data: ids,
        },
      );
      return res.data.result.success;
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
