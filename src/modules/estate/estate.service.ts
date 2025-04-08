import { Injectable, NotFoundException } from '@nestjs/common';

import { BQueryParams } from '@base/dto/base.dto';
import { PBaseService } from '@base/services/p-base.service';
import { Estate, EstateType } from '@prisma/client';
import { PrismaService } from '@prisma/services/prisma.service';

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

  async findAll() {
    return await super.findAll();
  }

  async findById(id: number) {
    const estate = await super.findById(id);
    if (!estate) {
      throw new NotFoundException(`Estate with ID ${id} not found`);
    }
    return estate;
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
    await super.findById(id);
    return await super.updateById(id, dto as any);
  }

  async delete(id: number) {
    await this.findById(id);

    return this.prisma.$transaction(async (tx) => {
      //delete area estate first
      await tx.estateArea.deleteMany({
        where: {
          estateId: id,
        },
      });
      //delete estate
      await tx.estate.delete({
        where: {
          id,
        },
      });
    });
  }

  async deleteMany(ids: number[]) {
    if (ids.length > 0) {
      await this.findByIds(ids);
    }
    return this.prisma.$transaction(async (tx) => {
      //delete area estate first
      await tx.estateArea.deleteMany({
        where: {
          estateId: { in: ids },
        },
      });
      //delete estate
      await tx.estate.deleteMany({
        where: {
          id: { in: ids },
        },
      });
    });
  }

  async restore(id: number) {
    return this.prisma.$transaction(async (tx) => {
      //restore estate
      const estate = await this.prisma.restore('Estate', { id });
      //restore estate area
      await this.prisma.restore('EstateArea', { estateId: id });
      //check if estate and estate area restored
      if (estate && estate.count > 0) {
        return this.findById(id);
      }
      throw new NotFoundException(`Estate with ID ${id} not found`);
    });
  }

  async restoreMany(ids: number[]) {
    return this.prisma.$transaction(async (tx) => {
      //restore estate
      const estates = await this.prisma.restore('Estate', { id: { in: ids } });
      //restore estate area
      await this.prisma.restore('EstateArea', { estateId: { in: ids } });
      //check if estate and estate area restored
      if (estates && estates.count > 0) {
        return this.findByIds(ids);
      }
      throw new NotFoundException(`Estate with ID ${ids} not found`);
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
