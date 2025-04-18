import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
  @ApiProperty({
    required: true,
    example: 'user@example.com'
  })
  account: string;

  @ApiProperty({
    required: true,
    example: 'cr7'
  })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiPropertyOptional({
    enum: EstateMemberRole,
    default: EstateMemberRole.MEMBER,
    example: EstateMemberRole.MEMBER,
    enumName: 'EstateMemberRole'
  })
  @IsEnum(EstateMemberRole)
  role?: EstateMemberRole = EstateMemberRole.MEMBER;
}
