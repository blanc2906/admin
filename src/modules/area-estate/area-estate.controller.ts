import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { BQueryParams } from '@base/dto/base.dto';

import { AreaEstateService } from '../area-estate/area-estate.service';
import { UpdateAreaEstateDto } from '../area-estate/dto/update-area-estate.dto';
import { CreateAreaEstateDto } from './dto/create-area-estate.dto';
import { DeleteAreasDto } from './dto/delete-areas.dto';
import { RestoreAreasDto } from './dto/restore-areas.dto';

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

  @Get('estate/:estateId/all')
  @ApiOperation({ summary: 'Find all area estates by estate ID ' })
  async findAll(@Param('estateId') estateId: string) {
    return this.areaEstateService.find('estateId', +estateId);
  }

  @Get('estate/:estateId/pagination')
  @ApiOperation({ summary: 'Pagination area estates by estate ID ' })
  async pagination(
    @Param('estateId') estateId: string,
    @Query() query: BQueryParams,
  ) {
    return this.areaEstateService.pagination(query, {
      field: 'estateId',
      value: +estateId,
    });
  }

  @Get('all')
  @ApiOperation({ summary: 'Find all area-estates' })
  async findAllAreaEstate() {
    return this.areaEstateService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find area estate by ID ' })
  async findById(@Param('id') id: string) {
    return this.areaEstateService.findById(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update area estate by ID ' })
  async update(@Param('id') id: string, @Body() dto: UpdateAreaEstateDto) {
    return this.areaEstateService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete area estate by ID ' })
  async delete(@Param('id') id: string) {
    return this.areaEstateService.deleteById(+id);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete many area estates ' })
  @ApiBody({ type: DeleteAreasDto })
  async deleteMany(@Body() deleteAreasDto: DeleteAreasDto) {
    return this.areaEstateService.deleteMany(deleteAreasDto.ids);
  }

  @Patch('restore')
  @ApiOperation({ summary: 'Restore many area estates ' })
  @ApiBody({ type: RestoreAreasDto })
  async restoreMany(@Body() restoreAreasDto: RestoreAreasDto) {
    return this.areaEstateService.restoreMany(restoreAreasDto.ids);
  }

  @Patch('/:id/restore')
  @ApiOperation({ summary: 'Restore area estate by ID ' })
  async restore(@Param('id') id: string) {
    return this.areaEstateService.restore(+id);
  }
}
