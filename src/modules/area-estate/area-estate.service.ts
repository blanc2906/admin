import { Controller, Injectable, NotFoundException } from '@nestjs/common';

import { BQueryParams } from '@base/dto/base.dto';
import { PBaseService } from '@base/services/p-base.service';
import { EstateArea } from '@prisma/client';
import { PrismaService } from '@prisma/services/prisma.service';

import { CNotFoundException } from '@shared/exception/http.exception';

import { CreateAreaEstateDto } from './dto/create-area-estate.dto';
import { UpdateAreaEstateDto } from './dto/update-area-estate.dto';

@Injectable()
export class AreaEstateService extends PBaseService<EstateArea> {
  constructor(private prisma: PrismaService) {
    super(prisma.estateArea);
  }

  async create(dto: CreateAreaEstateDto) {
    //check estate exits
    const estate = await this.prisma.estate.findUnique({
      where: {
        id: dto.estateId,
      },
    });

    if (!estate) {
      throw new CNotFoundException('Estate not found');
    }
    return await super.create(dto as any);
  }

  async find(key: string, estateId: any) {
    const areas = await super.find(key, estateId);
    return areas.map((area) => ({
      ...area,
      estate: area.estate,
    }));
  }

  async findById(id: number) {
    return await super.findById(id);
  }

  async findAll() {
    return await super.findAll();
  }

  async update(id: number, dto: UpdateAreaEstateDto) {
    return await super.updateById(id, dto);
  }

  async deleteById(id: number) {
    return await super.deleteById(id);
  }

  async deleteMany(ids: number[]) {
    return await super.deleteMany(ids);
  }

  async restore(id: number) {
    return await this.prisma.restore('EstateArea', { id });
  }

  async restoreMany(ids: number[]) {
    return await this.prisma.restore('EstateArea', { id: { in: ids } });
  }
}
