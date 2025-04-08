import { ApiProperty } from '@nestjs/swagger';

import { EstateType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateEstateDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  address: string;

  @ApiProperty({ enum: EstateType })
  @IsEnum(EstateType)
  type: EstateType = EstateType.DEFAULT;
}
