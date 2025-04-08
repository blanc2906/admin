import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsArray, IsNotEmpty } from 'class-validator';
import { IsString } from 'class-validator';
import { IsOptional } from 'class-validator';

export class UpdateAreaEstateDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ required: false })
  @IsString()
  @IsOptional()
  description: string;

  @ApiPropertyOptional({ required: false })
  @IsOptional()
  @IsArray()
  imageFileUrls?: string[];

  @ApiPropertyOptional({ required: false })
  @IsOptional()
  @IsArray()
  imageFileIds?: string[];
}
