import { ApiPropertyOptional } from '@nestjs/swagger';

import { AdminRole } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateAdminDto {
  @ApiPropertyOptional({ example: 'admin@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ enum: AdminRole })
  @IsEnum(AdminRole)
  @IsOptional()
  role?: AdminRole;
}
