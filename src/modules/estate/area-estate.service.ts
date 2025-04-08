import { Controller, Injectable, NotFoundException } from '@nestjs/common';

import { BQueryParams } from '@base/dto/base.dto';
import { PBaseService } from '@base/services/p-base.service';
import { EstateArea } from '@prisma/client';
import { PrismaService } from '@prisma/services/prisma.service';

import { CreateAreaEstateDto } from './dto/create-area-estate.dto';
import { UpdateAreaEstateDto } from './dto/update-area-estate.dto';

@Injectable()
export class AreaEstateService extends PBaseService<EstateArea> {
  constructor(private prisma: PrismaService) {
    super(prisma.estateArea);
  }

  async paginationby(estateId: number, query: BQueryParams) {
    const {
      page,
      limit = 10,
      sortBy,
      order = 'desc',
      search,
      searchFields = [],
    } = query;

    if (!page) throw new Error('Page is required');

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new Error('Page and limit must be numbers');
    }

    const skip = (pageNumber - 1) * limitNumber;
    const take = limitNumber;

    const orderBy = sortBy ? { [sortBy]: order } : undefined;

    let where: any = { estateId };

    if (search && searchFields.length > 0) {
      where = {
        ...where,
        OR: searchFields.map((field) => ({
          [field]: { contains: search, mode: 'insensitive' },
        })),
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.estateArea.findMany({ where, orderBy, skip, take }),
      this.prisma.estateArea.count({ where }),
    ]);

    return {
      items,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    };
  }
  async create(dto: CreateAreaEstateDto) {
    //check estate exits
    const estate = await this.prisma.estate.findUnique({
      where: {
        id: dto.estateId,
      },
    });

    if (!estate) {
      throw new NotFoundException('Estate not found');
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

  async updateById(id: number, dto: UpdateAreaEstateDto) {
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
