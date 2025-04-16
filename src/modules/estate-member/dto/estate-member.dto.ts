import { ApiProperty } from '@nestjs/swagger';

import { EstateMemberRole, EstateMemberStatus } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class EstateMemberDto {
  userId: number;
  estateId: number;
  nickname?: string;

  @ApiProperty({
    enum: EstateMemberRole,
    default: EstateMemberRole.MEMBER,
  })
  role: EstateMemberRole;

  @ApiProperty({
    enum: EstateMemberStatus,
    default: EstateMemberStatus.PENDING,
  })
  status: EstateMemberStatus;

  createdAt: Date;

  updatedAt?: Date;
}

export class GetAllMembersDto {
  @IsNumber()
  @IsOptional()
  estateId?: number;

  @IsEnum(EstateMemberRole)
  @IsOptional()
  role?: EstateMemberRole;

  @IsEnum(EstateMemberStatus)
  @IsOptional()
  status?: EstateMemberStatus;
}
