import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

import { EstateType } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

import { CreateEstateDto } from './create-estate.dto';

export class UpdateEstateDto extends PartialType(CreateEstateDto) {}
