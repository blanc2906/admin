import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { BQueryParams } from '@base/dto/base.dto';

import { AreaEstateService } from './area-estate.service';
import { CreateAreaEstateDto } from './dto/create-area-estate.dto';
import { UpdateAreaEstateDto } from './dto/update-area-estate.dto';

@ApiTags('Area Estate')
@Controller('area-estate')
@ApiBearerAuth()
export class AreaEstateController {
  constructor(private readonly areaEstateService: AreaEstateService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new area estate' })
  async create(@Body() dto: CreateAreaEstateDto) {
    return this.areaEstateService.create(dto);
  }

  @Get('findall/:estateId')
  @ApiOperation({ summary: 'Find all area estates by estate ID ' })
  async findAll(@Param('estateId') estateId: string) {
    return this.areaEstateService.find('estateId', +estateId);
  }

  @Get('/estateId/:id')
  @ApiOperation({ summary: 'Pagination area estates by estate ID ' })
  async pagination(@Param('id') id: string, @Query() query: BQueryParams) {
    return this.areaEstateService.paginationby(+id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find area estate by ID ' })
  async findById(@Param('id') id: string) {
    return this.areaEstateService.findById(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update area estate by ID ' })
  async update(@Param('id') id: string, @Body() dto: UpdateAreaEstateDto) {
    return this.areaEstateService.updateById(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete area estate by ID ' })
  async delete(@Param('id') id: string) {
    return this.areaEstateService.deleteById(+id);
  }

  @Delete('many')
  @ApiOperation({ summary: 'Delete many area estates ' })
  async deleteMany(@Body() ids: number[]) {
    return this.areaEstateService.deleteMany(ids);
  }

  @Put('restore/:id')
  @ApiOperation({ summary: 'Restore area estate by ID ' })
  async restore(@Param('id') id: string) {
    return this.areaEstateService.restore(+id);
  }

  @Put('restore-many')
  @ApiOperation({ summary: 'Restore many area estates ' })
  async restoreMany(@Body() ids: number[]) {
    return this.areaEstateService.restoreMany(ids);
  }
}
