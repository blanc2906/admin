import { Injectable, NotFoundException } from '@nestjs/common';
import { EstateMember, EstateMemberStatus } from '@prisma/client';
import { PrismaService } from '@prisma/services/prisma.service';
import { PBaseService } from '@base/services/p-base.service';

import { AddMemberDto } from './dto/members/add-member.dto';
import { UpdateMemberDto } from './dto/members/update-member.dto';
import { UpdateStatusMemberDto } from './dto/members/update-member.dto';
import { DeleteMemberDto, DeleteManyMemberDto } from './dto/members/delete-member.dto';


export class GetAllMembersDto {
  estateId?: number;
  role?: string;
  status?: EstateMemberStatus;
}

@Injectable()
export class EstateMemberService extends PBaseService<EstateMember> {
  constructor(private prisma: PrismaService) {
    super(prisma.estateMember);
  }

  async getListMember(estateId: number, input: GetAllMembersDto) {
    const whereCondition: any = { 
      estateId 
    };
    if (input.role) {
      whereCondition.role = input.role;
    }

    if (input.status) {
      whereCondition.status = input.status;
    }

    const members = await this.prisma.estateMember.findMany({
      where: whereCondition,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return members;
  }

  async addMemberToEstate(estateId: number, input: AddMemberDto) {
    
    const estate = await this.prisma.estate.findUnique({
      where: { id: estateId },
    });

    if (!estate) {
      throw new NotFoundException(`Estate with ID ${estateId} not found`);
    }

    let user = await this.prisma.user.findUnique({
      where: { email: input.account },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${input.account} not found`);
    }

    const existingMember = await this.prisma.estateMember.findUnique({
      where: {
        estateId_userId: {
          estateId,
          userId: user.id,
        },
      },
    });

    if (existingMember) {

      if (existingMember.deletedAt) {
        await this.prisma.restore('EstateMember', { 
          estateId_userId: {
            estateId,
            userId: user.id,
          },
        });

        return this.prisma.estateMember.update({
          where: {
            estateId_userId: {
              estateId,
              userId: user.id,
            },
          },
          data: {
            nickname: input.nickname,
            role: input.role,
            status: EstateMemberStatus.PENDING,
          },
        });
      }


      throw new Error(`User ${input.account} is already a member of this estate`);
    }


    return this.prisma.estateMember.create({
      data: {
        estateId,
        userId: user.id,
        nickname: input.nickname,
        role: input.role,
        status: EstateMemberStatus.PENDING,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async update(estateId: number, memberId: number, input: UpdateMemberDto) {

    const estate = await this.prisma.estate.findUnique({
      where: { id: estateId },
    });

    if (!estate) {
      throw new NotFoundException(`Estate with ID ${estateId} not found`);
    }

    const member = await this.prisma.estateMember.findFirst({
      where: {
        estateId,
        userId: memberId,
      },
    });

    if (!member) {
      throw new NotFoundException(`Member with ID ${memberId} not found in estate ${estateId}`);
    }

    return this.prisma.estateMember.update({
      where: {
        estateId_userId: {
          estateId,
          userId: memberId,
        },
      },
      data: {
        nickname: input.nickname,
        role: input.role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async updateStatus(estateId: number, memberId: number, input: UpdateStatusMemberDto) {

    const estate = await this.prisma.estate.findUnique({
      where: { id: estateId },
    });

    if (!estate) {
      throw new NotFoundException(`Estate with ID ${estateId} not found`);
    }

    const member = await this.prisma.estateMember.findFirst({
      where: {
        estateId,
        userId: memberId,
      },
    });

    if (!member) {
      throw new NotFoundException(`Member with ID ${memberId} not found in estate ${estateId}`);
    }

    return this.prisma.estateMember.update({
      where: {
        estateId_userId: {
          estateId,
          userId: memberId,
        },
      },
      data: {
        status: input.status,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(estateId: number, input: DeleteMemberDto) {
    const estate = await this.prisma.estate.findUnique({
      where: { id: estateId },
    });

    if (!estate) {
      throw new NotFoundException(`Estate with ID ${estateId} not found`);
    }

    const member = await this.prisma.estateMember.findFirst({
      where: {
        estateId,
        userId: input.userId,
      },
    });

    if (!member) {
      throw new NotFoundException(`Member with ID ${input.userId} not found in estate ${estateId}`);
    }

    if (member.role === 'OWNER') {
      throw new Error('Cannot remove the owner of the estate');
    }

    return this.prisma.estateMember.delete({
      where: {
        estateId_userId: {
          estateId,
          userId: input.userId,
        },
      },
    });
  }

  async removeMany(estateId: number, input: DeleteManyMemberDto) {
    const estate = await this.prisma.estate.findUnique({
      where: { id: estateId },
    });

    if (!estate) {
      throw new NotFoundException(`Estate with ID ${estateId} not found`);
    }

    if (!input.ids || input.ids.length === 0) {
      return { count: 0 };
    }

    const members = await this.prisma.estateMember.findMany({
      where: {
        estateId,
        userId: { in: input.ids },
      },
    });

    const ownerInList = members.some(member => member.role === 'OWNER');
    if (ownerInList) {
      throw new Error('Cannot remove the owner of the estate');
    }

    return this.prisma.estateMember.deleteMany({
      where: {
        estateId,
        userId: { in: input.ids },
      },
    });
  }
}