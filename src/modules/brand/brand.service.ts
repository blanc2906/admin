import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/services/prisma.service'; 
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandService {
  constructor(private prisma: PrismaService) {}

  async create(createBrandDto: CreateBrandDto) {
    // Check if brand with same code exists
    const existingBrand = await this.prisma.deviceBrand.findUnique({
      where: { code: createBrandDto.code }
    });

    if (existingBrand) {
      throw new BadRequestException('Brand with this code already exists');
    }

    return this.prisma.deviceBrand.create({
      data: createBrandDto
    });
  }

  async findAll() {
    return this.prisma.deviceBrand.findMany({
      where: { deletedAt: null }
    });
  }

  async findOne(id: number) {
    const brand = await this.prisma.deviceBrand.findFirst({
      where: { id, deletedAt: null }
    });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    return brand;
  }

  async update(id: number, updateBrandDto: UpdateBrandDto) {
    // Check if brand exists and is not default if trying to update
    const existingBrand = await this.findOne(id);
    
    if (existingBrand.isDefault) {
      throw new BadRequestException('Cannot update default brand');
    }

    // If updating code, check if new code already exists
    if (updateBrandDto.code) {
      const brandWithCode = await this.prisma.deviceBrand.findUnique({
        where: { code: updateBrandDto.code }
      });

      if (brandWithCode && brandWithCode.id !== id) {
        throw new BadRequestException('Brand with this code already exists');
      }
    }

    return this.prisma.deviceBrand.update({
      where: { id },
      data: updateBrandDto
    });
  }

  async remove(id: number) {
    // Check if brand exists and is not default
    const brand = await this.findOne(id);
    
    if (brand.isDefault) {
      throw new BadRequestException('Cannot delete default brand');
    }

    return this.prisma.deviceBrand.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
} 