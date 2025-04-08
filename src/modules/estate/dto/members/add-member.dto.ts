import { ApiPropertyOptional } from '@nestjs/swagger';

import { EstateMemberRole } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class AddMemberDto {
  @IsString()
  @IsNotEmpty()
  account: string;

  @IsString()
  @IsOptional()
  tenancyName?: string;

  @IsNumber()
  @IsOptional()
  tenancyId?: number;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiPropertyOptional({
    enum: EstateMemberRole,
    default: EstateMemberRole.MEMBER,
  })
  @IsEnum(EstateMemberRole)
  role?: EstateMemberRole = EstateMemberRole.MEMBER;
}
