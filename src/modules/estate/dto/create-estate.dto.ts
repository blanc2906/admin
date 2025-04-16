import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { EstateType } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateEstateDto {
  @ApiProperty({
    description: 'Name of the estate',
  })
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Description of the estate' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ enum: EstateType, description: 'Type of the estate' })
  @IsEnum(EstateType)
  type: EstateType = EstateType.DEFAULT;
}
