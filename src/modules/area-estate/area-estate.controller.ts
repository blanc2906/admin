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

import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { BQueryParams } from '@base/dto/base.dto';

import { AreaEstateService } from '../area-estate/area-estate.service';
import { UpdateAreaEstateDto } from '../area-estate/dto/update-area-estate.dto';
import { CreateAreaEstateDto } from './dto/create-area-estate.dto';
import { DeleteAreasDto } from './dto/delete-areas.dto';
import { RestoreAreasDto } from './dto/restore-areas.dto';

@ApiTags('Area Estate')
@Controller('area-estate')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AreaEstateController {
  constructor(private readonly areaEstateService: AreaEstateService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new area estate' })
  async create(@Body() dto: CreateAreaEstateDto) {
    return this.areaEstateService.create(dto);
  }

  @Get('estate/:estateId')
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

  @Get(':id')
  @ApiOperation({ summary: 'Find area estate by ID ' })
  async findById(@Param('id') id: string) {
    return this.areaEstateService.findById(+id);
  }

  @Patch('restore')
  @ApiOperation({ summary: 'Restore one or many area estates ' })
  @ApiBody({ type: RestoreAreasDto })
  async restoreMany(@Body() restoreAreasDto: RestoreAreasDto) {
    return this.areaEstateService.restoreMany(restoreAreasDto.ids);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update area estate by ID ' })
  async update(@Param('id') id: string, @Body() dto: UpdateAreaEstateDto) {
    return this.areaEstateService.update(+id, dto);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete one or many area estates ' })
  @ApiBody({ type: DeleteAreasDto })
  async deleteMany(@Body() deleteAreasDto: DeleteAreasDto) {
    return this.areaEstateService.deleteMany(deleteAreasDto.ids);
  }
}
