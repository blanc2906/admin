import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { EstateMemberRole, EstateMemberStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateMemberDto {
  @ApiProperty({
    required: false,
    example: 'Cris Ronaldo'
  })
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiPropertyOptional({
    enum: EstateMemberRole,
    default: EstateMemberRole.MEMBER,
    example: EstateMemberRole.MEMBER,
    enumName: 'EstateMemberRole'
  })
  @IsEnum(EstateMemberRole)
  role?: EstateMemberRole;

  @ApiPropertyOptional({
    enum: EstateMemberStatus,
    default: EstateMemberStatus.ACTIVE,
    example: EstateMemberStatus.ACTIVE,
    enumName: 'EstateMemberStatus'
  })
  @IsEnum(EstateMemberStatus)
  status?: EstateMemberStatus;
}