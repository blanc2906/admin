import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';

import { CreateUserDto } from './dto/create-user.dto';
import { DeleteMultipleUserDto } from './dto/delete-multiple-user.dto';
import { FindAllUserDto } from './dto/find-all-user.dto';
import { UserService } from './services/user.service';

@Controller('user')
@ApiTags('User')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
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
