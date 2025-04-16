import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { EstateMemberRole, EstateMemberStatus } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateMemberDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiProperty({
    required: true,
  })
  @IsOptional()
  @ApiPropertyOptional({
    enum: EstateMemberRole,
    default: EstateMemberRole.MEMBER,
  })
  @IsEnum(EstateMemberRole)
  role: EstateMemberRole;
}

export class ChangeOwnerDto {
  @IsNumber()
  @IsOptional()
  memberId?: number;
}

export class UpdateStatusMemberDto {
  @ApiProperty({ enum: EstateMemberStatus, default: EstateMemberStatus.ACTIVE })
  @IsEnum(EstateMemberStatus)
  status: EstateMemberStatus;
}