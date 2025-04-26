import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { BQueryParams } from '@base/dto/base.dto';
import { PBaseService } from '@base/services/p-base.service';
import { Estate, EstateType } from '@prisma/client';
import { PrismaService } from '@prisma/services/prisma.service';

import { ApiResponseCode } from '@shared/constant/response-code.constant';
import { CNotFoundException } from '@shared/exception/http.exception';

import { CreateEstateDto } from './dto/create-estate.dto';
import { UpdateEstateDto } from './dto/update-estate.dto';

@Injectable()
export class EstateService extends PBaseService<Estate> {
  constructor(private prisma: PrismaService) {
    super(prisma.estate);
  }

  async create(dto: CreateEstateDto) {
    return await super.create(dto as any);
  }
  async findById(id: number) {
    return await super.findById(id);
  }

  async findByIds(ids: number[]) {
    return this.prisma.estate.findMany({
      where: { id: { in: ids } },
      include: {
        areas: true,
      },
    });
  }

  async update(id: number, dto: UpdateEstateDto) {
    return await super.updateById(id, dto as any);
  }

  async deleteMany(ids: number[]) {
    const estates = await this.findByIds(ids);
    return this.prisma.$transaction(async (tx) => {
      //delete area estate first
      await tx.estateArea.deleteMany({
        where: {
          estateId: { in: estates.map((estate) => estate.id) },
        },
      });
      //delete estate
      await tx.estate.deleteMany({
        where: {
          id: { in: estates.map((estate) => estate.id) },
        },
      });
    });
  }

  async restoreMany(ids: number[]) {
    return this.prisma.$transaction(async (tx) => {
      const estates = await this.prisma.restore('Estate', { id: { in: ids } });

      await this.prisma.restore('EstateArea', { estateId: { in: ids } });

      if (estates && estates.count > 0) {
        return this.findByIds(ids);
      }
      throw new CNotFoundException(
        `Estate with ID ${ids} not restored or not deleted`,
      );
    });
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
