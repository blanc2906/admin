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

import { BaseController } from '@base/controllers/p-base.controller';
import { BQueryParams } from '@base/dto/base.dto';
import { Estate } from '@prisma/client';

import {
  ApiArrayResponse,
  TransformResponse,
} from '@shared/util/response.transform';

import { CreateEstateDto } from './dto/create-estate.dto';
import { DeleteEstatesDto } from './dto/deleteEstates.dto';
import { RestoreEstatesDto } from './dto/restoreEstates.dto';
import { UpdateEstateDto } from './dto/update-estate.dto';
import { EstateService } from './estate.service';

@ApiTags('Estate')
@Controller('estates')
@ApiBearerAuth()
export class EstateController extends BaseController<EstateService> {
  constructor(private readonly estateService: EstateService) {
    super(estateService);
  }

  @Get('all')
  @ApiOperation({ summary: 'Find all estates ' })
  async findAll() {
    return await this.estateService.findAll();
  }

  @Get()
  @ApiOperation({ summary: 'Pagination estates ' })
  async pagination(@Query() query: BQueryParams) {
    return this.estateService.pagination(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find estate by ID ' })
  async findOne(@Param('id') id: string) {
    return this.estateService.findById(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new estate ' })
  async create(@Body() createEstateDto: CreateEstateDto) {
    return this.estateService.create(createEstateDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update estate by ID ' })
  async update(
    @Param('id') id: string,
    @Body() updateEstateDto: UpdateEstateDto,
  ) {
    return this.estateService.update(+id, updateEstateDto);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete many estates' })
  @ApiBody({ type: DeleteEstatesDto })
  async deleteEstates(@Body() deleteEstatesDto: DeleteEstatesDto) {
    return this.estateService.deleteMany(deleteEstatesDto.ids);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete estate by ID' })
  async delete(@Param('id') id: string) {
    return this.estateService.delete(+id);
  }

  @Patch('restore')
  @ApiOperation({ summary: 'Restore many estates ' })
  @ApiBody({ type: RestoreEstatesDto })
  async restoreEstates(@Body() restoreEstates: RestoreEstatesDto) {
    return this.estateService.restoreMany(restoreEstates.ids);
  }

  @Patch('/:id/restore')
  @ApiOperation({ summary: 'Restore estate by ID ' })
  async restore(@Param('id') id: string) {
    return this.estateService.restore(+id);
  }
}
