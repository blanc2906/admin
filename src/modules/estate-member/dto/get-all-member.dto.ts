import { ApiPropertyOptional } from '@nestjs/swagger';
import { EstateMemberRole, EstateMemberStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';


export class GetAllMembersDto {

  @IsEnum(EstateMemberRole)
  @IsOptional()
  @ApiPropertyOptional({
    enum: EstateMemberRole,
    example: EstateMemberRole.MEMBER,
    enumName: 'EstateMemberRole'
  })
  role?: EstateMemberRole;

  @IsEnum(EstateMemberStatus)
  @IsOptional()
  @ApiPropertyOptional({
    enum: EstateMemberStatus,
    example: EstateMemberStatus.ACTIVE,
    enumName: 'EstateMemberStatus'
  })
  status?: EstateMemberStatus;
}
