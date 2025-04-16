import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

import { IsArray, IsNotEmpty } from 'class-validator';
import { IsString } from 'class-validator';
import { IsOptional } from 'class-validator';

import { CreateAreaEstateDto } from '../../area-estate/dto/create-area-estate.dto';

export class UpdateAreaEstateDto extends PartialType(CreateAreaEstateDto) {}
