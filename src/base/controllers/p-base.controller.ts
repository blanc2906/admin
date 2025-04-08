import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

import { BQueryParams } from '@base/dto/base.dto';

export class BaseController<T> {
  constructor(protected readonly baseService: T) {}

  @Get('/all')
  async findAll() {
    return (this.baseService as any).findAll();
  }

  @Get()
  async pagination(@Query() query: BQueryParams) {
    return (this.baseService as any).pagination(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return (this.baseService as any).findById(id);
  }

  @Post()
  @ApiBody({ type: 'CreateDto' as any })
  async create(@Body() createDto: any) {
    return (this.baseService as any).create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: Partial<any>) {
    return (this.baseService as any).updateById(id, updateDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return (this.baseService as any).deleteById(id);
  }

  @Delete('many')
  async deleteMany(@Body() ids: string[]) {
    return (this.baseService as any).deleteMany(ids);
  }

  @Put('restore/:id')
  async restore(@Param('id') id: string) {
    return (this.baseService as any).restoreById(id);
  }

  @Put('restore-many')
  async restoreMany(@Body() ids: string[]) {
    return (this.baseService as any).restoreMany(ids);
  }
}
