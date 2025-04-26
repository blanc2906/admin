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
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ChangePasswordDto } from '@auth/dto/change-password.dto';
import { BQueryParams } from '@base/dto/base.dto';
import { AdminRole } from '@prisma/client';

import {
  ApiPaginatedResponse,
  ApiResponse,
} from '@shared/util/response.transform';

import { Roles } from '../decorators/roles.decorator';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateAdminDto } from '../dto/update-admin.dto';
import { AdminEntity } from '../entities/admin.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { AdminService } from '../services/admin.service';

@ApiTags('Admin')
@Controller('admins')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @Roles(AdminRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create Sup Admin (only Super Admin)' })
  @ApiResponse(AdminEntity)
  create(@Body() createAdminDto: CreateAdminDto, @Request() req) {
    return this.adminService.createAdmin(createAdminDto, req.user.role);
  }

  @Get()
  @Roles(AdminRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get list of admins (only Super Admin)' })
  @ApiPaginatedResponse(AdminEntity)
  findAll(@Query() query: BQueryParams) {
    return this.adminService.pagination(query);
  }

  @Get(':id')
  @Roles(AdminRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get admin info by ID (only Super Admin)' })
  @ApiResponse(AdminEntity)
  findOne(@Param('id') id: string) {
    return this.adminService.findById(+id);
  }

  @Patch(':id/change-role')
  @Roles(AdminRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update admin role (only Super Admin)' })
  @ApiResponse(AdminEntity)
  update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @Request() req,
  ) {
    return this.adminService.updateRole(+id, updateAdminDto, req.user.role);
  }

  @Patch(':id/password')
  @ApiOperation({ summary: 'Update admin password (only Super Admin)' })
  @ApiResponse(AdminEntity)
  changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req,
  ) {
    return this.adminService.changePassword(
      +id,
      changePasswordDto,
      req.user.role,
    );
  }

  @Delete(':id')
  @Roles(AdminRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete admin account (only Super Admin)' })
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }

  @Patch(':id/restore')
  @Roles(AdminRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Restore admin account (only Super Admin)' })
  @ApiResponse(AdminEntity)
  restore(@Param('id') id: string) {
    return this.adminService.restore(+id);
  }
}
