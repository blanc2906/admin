import { ApiProperty } from '@nestjs/swagger';

import { EstateMemberRole, EstateMemberStatus } from '@prisma/client';

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
