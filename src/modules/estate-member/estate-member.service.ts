import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/services/prisma.service';
import { PBaseService } from '@base/services/p-base.service';
import { UserService } from '@src/modules/user/services/user.service';

import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';   
import { DeleteManyMemberDto, DeleteMemberDto } from './dto/delete-member.dto';
import { FindAllUserDto } from '@src/modules/user/dto/find-all-user.dto';

import { GetAllMembersDto } from './dto/estate-member.dto';
import { UpdateStatusMemberDto } from './dto/update-member.dto';
import { EstateMember, EstateMemberRole, EstateMemberStatus } from '@prisma/client';

@Injectable()
export class EstateMemberService extends PBaseService<EstateMember> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) {
    super(prisma.estateMember);
  }

  private readonly memberSelect = {
    id: true,
    name: true,
    email: true,
  };

  private async validateEstate(estateId: number) {
    const estate = await this.prisma.estate.findUnique({
      where: { id: estateId },
    });

    if (!estate) {
      throw new NotFoundException(`Estate with ID ${estateId} not found`);
    }
    return estate;
  }

  private async validateMember(estateId: number, memberId: number) {
    const member = await this.prisma.estateMember.findFirst({
      where: { estateId, memberId },
    });

    if (!member) {
      throw new NotFoundException(`Member with ID ${memberId} not found in estate ${estateId}`);
    }
    return member;
  }

  /**
   * Get all members of an estate
   */
  async getListMember(estateId: number, input: GetAllMembersDto = {}) {
    await this.validateEstate(estateId);

    const whereCondition: any = { 
      estateId,
      ...(input.role && { role: input.role }),
      ...(input.status && { status: input.status })
    };

    return this.prisma.estateMember.findMany({
      where: whereCondition,
      include: { user: { select: this.memberSelect } },
    });
  }

  /**
   * Add a member to an estate
   */
  async addMemberToEstate(estateId: number, input: AddMemberDto) {
    await this.validateEstate(estateId);

    const findUserParams: FindAllUserDto = {
      keyword: input.account,
      skipCount: 0,
      maxResultCount: 10
    };
    
    const usersResult = await this.userService.findAll(findUserParams);
    
    if (!usersResult?.data) {
      throw new NotFoundException(`User with email ${input.account} not found`);
    }
    
    const userData = Array.isArray(usersResult.data) ? usersResult.data : [usersResult.data];
    
    if (userData.length === 0) {
      throw new NotFoundException(`User with email ${input.account} not found`);
    }
    
    const user = userData.find(u => 
      (u.emailAddress && u.emailAddress === input.account) || 
      (u.email && u.email === input.account)
    );
    
    if (!user) {
      throw new NotFoundException(`User with email ${input.account} not found`);
    }
    
    const userIdRaw = user.id || user.globalId;
    if (userIdRaw === undefined) {
      throw new Error(`User found but no valid ID for user with email ${input.account}`);
    }
    
    const userId = Number(userIdRaw);

    // Ensure user exists in local database
    const localUser = await this.prisma.estateMember.findUnique({
      where: { memberId: userId }
    });

    if (!localUser) {
      // Create user in local database if it doesn't exist
      await this.prisma.estateMember.create({
        data: {
          memberId: userId,
          //name: user.name || user.fullName || '',
          //email: user.emailAddress || user.email || input.account,
          password: '', // You might want to generate a random password or handle this differently
        }
      });
    }
    
    const memberData = {
      nickname: input.nickname,
      role: input.role || EstateMemberRole.MEMBER,
      status: EstateMemberStatus.PENDING,
    };

    const existingMember = await this.prisma.estateMember.findUnique({
      where: { estateId_memberId: { estateId, userId } },
    });

    if (existingMember) {
      if (existingMember.deletedAt) {
        await this.prisma.restore('EstateMember', { 
          estateId_userId: { estateId, userId }
        });

        return this.prisma.estateMember.update({
          where: { estateId_userId: { estateId, userId } },
          data: memberData,
          include: { user: { select: this.userSelect } },
        });
      }
      throw new Error(`User ${input.account} is already a member of this estate`);
    }

    return this.prisma.estateMember.create({
      data: {
        estateId,
        userId,
        ...memberData,
      },
      include: { user: { select: this.userSelect } },
    });
  }

  /**
   * Update member's details
   */
  async update(estateId: number, memberId: number, input: UpdateMemberDto) {
    await this.validateEstate(estateId);
    await this.validateMember(estateId, memberId);

    return this.prisma.estateMember.update({
      where: { estateId_userId: { estateId, userId: memberId } },
      data: {
        nickname: input.nickname,
        role: input.role,
      },
      include: { user: { select: this.userSelect } },
    });
  }

  /**
   * Update member's status
   */
  async updateStatus(estateId: number, memberId: number, input: UpdateStatusMemberDto) {
    await this.validateEstate(estateId);
    await this.validateMember(estateId, memberId);

    return this.prisma.estateMember.update({
      where: { estateId_userId: { estateId, userId: memberId } },
      data: { status: input.status },
      include: { user: { select: this.userSelect } },
    });
  }

  /**
   * Remove member from estate
   */
  async remove(estateId: number, input: DeleteMemberDto) {
    await this.validateEstate(estateId);
    const member = await this.validateMember(estateId, input.userId);

    if (member.role === EstateMemberRole.OWNER) {
      throw new Error('Cannot remove the owner of the estate');
    }

    return this.prisma.estateMember.delete({
      where: { estateId_userId: { estateId, userId: input.userId } },
    });
  }

  /**
   * Remove multiple members from estate
   */
  async removeMany(estateId: number, input: DeleteManyMemberDto) {
    await this.validateEstate(estateId);

    if (!input.ids?.length) {
      return { count: 0 };
    }

    const members = await this.prisma.estateMember.findMany({
      where: { estateId, userId: { in: input.ids } },
    });

    if (members.some(member => member.role === EstateMemberRole.OWNER)) {
      throw new Error('Cannot remove the owner of the estate');
    }

    return this.prisma.estateMember.deleteMany({
      where: { estateId, userId: { in: input.ids } },
    });
  }
}
