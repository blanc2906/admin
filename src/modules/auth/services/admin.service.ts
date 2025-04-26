import { Injectable } from '@nestjs/common';

import { ChangePasswordDto } from '@auth/dto/change-password.dto';
import { BQueryParams } from '@base/dto/base.dto';
import { PBaseService } from '@base/services/p-base.service';
import { AdminAccount, AdminRole } from '@prisma/client';
import { PrismaService } from '@prisma/services/prisma.service';
import * as bcrypt from 'bcrypt';

import {
  CBadRequestException,
  CConflictException,
  CNotFoundException,
  CUnauthorizedException,
} from '@shared/exception/http.exception';

import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateAdminDto } from '../dto/update-admin.dto';
import { AdminEntity } from '../entities/admin.entity';

@Injectable()
export class AdminService extends PBaseService<AdminAccount> {
  constructor(private prisma: PrismaService) {
    super(prisma.adminAccount);
  }

  async createAdmin(
    createAdminDto: CreateAdminDto,
    creatorRole: AdminRole,
  ): Promise<AdminEntity> {
    const existingAdmin = await super.find('email', createAdminDto.email);
    if (existingAdmin && existingAdmin.length > 0) {
      throw new CConflictException(
        'AdminService.create',
        'Email already exists',
      );
    }
    //Only SuperAdmin can create admin
    if (
      createAdminDto.role === AdminRole.SUPER_ADMIN &&
      creatorRole !== AdminRole.SUPER_ADMIN
    ) {
      throw new CBadRequestException(
        'AdminService.create',
        'You do not have permission to create a Super Admin account',
      );
    }

    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    const newAdmin = await this.prisma.adminAccount.create({
      data: {
        email: createAdminDto.email,
        password: hashedPassword,
        role: createAdminDto.role || AdminRole.SUB_ADMIN,
      },
    });

    return new AdminEntity(newAdmin);
  }

  async findAll() {
    return await super.findAll();
  }

  async findById(id: number): Promise<AdminEntity> {
    const admin = await super.findById(id);
    return new AdminEntity(admin);
  }

  async updateRole(
    id: number,
    updateAdminDto: UpdateAdminDto,
    updaterRole: AdminRole,
  ): Promise<AdminEntity> {
    const admin = await this.findById(id);

    if (!admin) {
      throw new CNotFoundException('AdminService.update', 'Admin not found');
    }

    if (updaterRole !== AdminRole.SUPER_ADMIN) {
      throw new CBadRequestException(
        'AdminService.update',
        'You do not have permission to update role',
      );
    }

    const updatedAdmin = await super.updateById(id, updateAdminDto);

    return new AdminEntity(updatedAdmin);
  }

  async changePassword(
    id: number,
    changePasswordDto: ChangePasswordDto,
    updaterRole: AdminRole,
  ): Promise<AdminEntity> {
    const admin = await this.findById(id);

    if (!admin) {
      throw new CNotFoundException(
        'AdminService.changePassword',
        'Admin account do not exist',
      );
    }

    if (updaterRole !== AdminRole.SUPER_ADMIN) {
      throw new CBadRequestException(
        'AdminService.update',
        'You do not have permission to update password',
      );
    }

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      admin.password,
    );

    if (!isPasswordValid) {
      throw new CUnauthorizedException(
        'AdminService.changePassword',
        'Current password is wrong',
      );
    }
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    const updatedAdmin = await this.prisma.adminAccount.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });

    return new AdminEntity(updatedAdmin);
  }

  async remove(id: number) {
    return await super.deleteById(id);
  }

  async restore(id: number): Promise<AdminEntity> {
    const restoredAdmin = await this.prisma.restore('AdminAccount', { id });
    return new AdminEntity(restoredAdmin);
  }

  async pagination(query: BQueryParams): Promise<{
    items: any;
    total: any;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return await super.pagination(query);
  }
}
