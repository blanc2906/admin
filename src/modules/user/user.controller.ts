import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { DeleteMultipleUserDto } from './dto/delete-multiple-user.dto';
import { FindAllUserDto } from './dto/find-all-user.dto';
import { UserService } from './services/user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  async findAll(@Query() params: FindAllUserDto) {
    return await this.userService.findAll(params);
  }

  @Delete()
  async remove(@Body() payload: DeleteMultipleUserDto) {
    return await this.userService.remove(payload.ids);
  }
}
