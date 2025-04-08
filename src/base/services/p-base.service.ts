import { PrismaService } from '@prisma/services/prisma.service';

import { BQueryParams } from '../dto/base.dto';

export class PBaseService<T> {
  constructor(protected model: any) {}
  async findAll() {
    return this.model.findMany();
  }
  async pagination(query: BQueryParams) {
    const {
      page,
      limit = 10,
      sortBy,
      order = 'desc',
      search,
      searchFields = [],
    } = query;

    if (!page) {
      throw new Error('Page is required');
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new Error('Page and limit must be numbers');
    }

    const skip = (pageNumber - 1) * limitNumber;
    const take = limitNumber;

    const orderBy = sortBy ? { [sortBy]: order } : undefined;
    let where = {};
    if (search && searchFields.length > 0) {
      where = {
        OR: searchFields.map((field) => ({
          [field]: { contains: search, mode: 'insensitive' },
        })),
      };
    }

    const [items, total] = await Promise.all([
      this.model.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      this.model.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async find(key: string, value: any) {
    const where = {
      [key]: value,
    };

    return this.model.findMany({ where });
  }

  async findOne(key: string, value: any) {
    const where = {
      [key]: value,
    };

    return this.model.findFirst({ where });
  }
  async findById(id: number) {
    return this.model.findUnique({
      where: { id },
    });
  }

  async create(data: Partial<T>) {
    return this.model.create({ data });
  }

  async updateById(id: number, data: Partial<T>) {
    return this.model.update({ where: { id }, data });
  }

  async deleteById(id: number) {
    return this.model.delete({ where: { id } });
  }

  async deleteMany(ids: number[]) {
    return this.model.deleteMany({ where: { id: { in: ids } } });
  }
}
