import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { EstateType } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateEstateDto {
  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  address: string;

  @IsOptional()
  @ApiPropertyOptional({ enum: EstateType })
  @IsEnum(EstateType)
  type: EstateType = EstateType.DEFAULT;
}
