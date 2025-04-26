import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AdminRole } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ example: 'admin@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({ enum: AdminRole, default: AdminRole.SUB_ADMIN })
  @IsEnum(AdminRole)
  @IsOptional()
  role?: AdminRole;
}
