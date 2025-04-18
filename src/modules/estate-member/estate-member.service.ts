import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/services/prisma.service';
import { PBaseService } from '@base/services/p-base.service';
import { EstateMember, EstateMemberRole, EstateMemberStatus } from '@prisma/client';
import { UserService } from '@src/modules/user/services/user.service';

import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';   
import { DeleteManyMemberDto } from './dto/delete-member.dto';
import { FindAllUserDto } from '@src/modules/user/dto/find-all-user.dto';
import { GetAllMembersDto } from './dto/get-all-member.dto';
import { CNotFoundException, CBadRequestException } from '@shared/exception/http.exception';

@Injectable()
export class EstateMemberService extends PBaseService<EstateMember> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) {
    super(prisma.estateMember);
  }

  /**
   * Validate estate exists
   */
  private async validateEstate(estateId: number) {
    const estate = await this.prisma.estate.findUnique({
      where: { id: estateId },
    });

    if (!estate) {
      throw new CNotFoundException(`Estate with ID ${estateId} not found`);
    }
    return estate;
  }
  

  /**
   * Validate member exists in estate
   */
  private async validateMember(estateId: number, userId: number) {
    const member = await this.prisma.estateMember.findFirst({
      where: { 
        estateId: estateId,
        userId: userId
      },
    });

    if (!member) {
      throw new CNotFoundException(`Member with ID ${userId} not found in estate ${estateId}`);
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

    const members = await this.prisma.estateMember.findMany({
      where: whereCondition,
    });

    return members;
  }

  /**
   * Add a member to an estate
   */
  async addMemberToEstate(estateId: number, input: AddMemberDto) {
    await this.validateEstate(estateId);

    const findUserParams: FindAllUserDto = {
      keyword: input.account,
      skipCount: 0,
      //maxResultCount: 10
    };
    
    try {
      const usersResult = await this.userService.findAll(findUserParams);
      
      if (!usersResult?.data || !Array.isArray(usersResult.data) || usersResult.data.length === 0) {
        throw new CNotFoundException(`User with account ${input.account} not found`);
      }
      
      const user = usersResult.data.find(u => 
        (u.emailAddress && u.emailAddress === input.account) || 
        (u.email && u.email === input.account)
      );
      
      if (!user) {
        throw new CNotFoundException(`User with account ${input.account} not found`);
      }
      
      const userId = user.id || user.globalId;
      const existingMember = await this.prisma.estateMember.findFirst({
        where: { 
          estateId: estateId,
          userId: userId,
          OR: [
            { deletedAt: null },
            { deletedAt: { not: null } }
          ]
        },
      });

      if (existingMember) {
        if (existingMember.deletedAt) {
          // Nếu member đã bị soft delete, restore lại
          await this.prisma.estateMember.update({
            where: { 
              estateId_userId: {
                estateId,
                userId
              }
            },
            data: {
              deletedAt: null,
              nickname: input.nickname,
              role: input.role || EstateMemberRole.MEMBER,
              status: EstateMemberStatus.PENDING,
              updatedAt: new Date()
            }
          });

          return this.prisma.estateMember.findFirst({
            where: { 
              estateId: estateId,
              userId: userId,
              deletedAt: null
            }
          });
        }
        throw new CBadRequestException(`User ${input.account} is already a member of this estate`);
      }

      // Create new member
      return this.prisma.estateMember.create({
        data: {
          estateId,
          userId,
          nickname: input.nickname,
          role: input.role || EstateMemberRole.MEMBER,
          status: EstateMemberStatus.PENDING,
          fullName: user.fullName || user.name || '',
          emailAddress: user.emailAddress || user.email || input.account,
          imageUrl: user.imageUrl || null,
          globalUserId: user.globalId || null
        }
      });
      
    } catch (error) {
      if (error instanceof CNotFoundException || error instanceof CBadRequestException) {
        throw error;
      }
      throw new CBadRequestException(`Failed to add member: ${error.message}`);
    }
  }

  /**
   * Update member's details
   */
  async update(estateId: number, userId: number, input: UpdateMemberDto) {
    await this.validateEstate(estateId);
    await this.validateMember(estateId, userId);

    await this.prisma.estateMember.updateMany({
      where: {
        estateId: estateId,
        userId: userId,
        deletedAt: null
      },
      data: {
        nickname: input.nickname,
        role: input.role,
        status: input.status,
        updatedAt: new Date()
      }
    });

    return this.prisma.estateMember.findFirst({
      where: {
        estateId: estateId,
        userId: userId,
        deletedAt: null
      }
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
      where: { estateId, userId: { in: input.ids } }
    });

    if (members.some(member => member.role === EstateMemberRole.OWNER)) {
      throw new CBadRequestException('Cannot remove the owner of the estate');
    }

    return this.prisma.estateMember.updateMany({
      where: { 
        estateId, 
        userId: { in: input.ids },
        deletedAt: null
      },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date()
      }
    });
  }
}