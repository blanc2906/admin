import { Injectable } from '@nestjs/common';

import { YoolifeUserService } from '@src/modules/yoolife/services/yoolife-user.service';

import { CreateUserDto } from '../dto/create-user.dto';
import { FindAllUserDto } from '../dto/find-all-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly yoolifeUserService: YoolifeUserService) {}
  async create(createUserDto: CreateUserDto) {
    const result = await this.yoolifeUserService.create(createUserDto);
    return result;
  }

  async findAll(params: FindAllUserDto) {
    const result = await this.yoolifeUserService.findAllUsers(params);
    return result;
  }

  async remove(ids: number[]) {
    const result = await this.yoolifeUserService.remove(ids);
    return result;
  }
}
