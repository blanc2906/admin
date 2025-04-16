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
    })
  account: string;

  // @ApiProperty({
  //   required: true,
  // })
  // @IsString()
  // @IsOptional()
  // tenancyName?: string;

  // @ApiProperty({
  //   required: true,
  // })
  // @IsNumber()
  // @IsOptional()
  // tenancyId?: number;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiPropertyOptional({
    enum: EstateMemberRole,
    default: EstateMemberRole.MEMBER,
  })
  @ApiProperty({
    required: true,
    enum: ['OWNER', 'ADMIN' , 'MEMBER'],
  })
  @IsEnum(EstateMemberRole)
  role?: EstateMemberRole = EstateMemberRole.MEMBER;
}
