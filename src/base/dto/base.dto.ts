import { ApiProperty } from '@nestjs/swagger';

import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class BQueryParams {
  @ApiProperty({
    required: true,
    type: Number,
    default: 0,
    description: 'Page number',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  page: number;
  @ApiProperty({
    required: false,
    type: Number,
    default: 10,
    description: 'Number of items per page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Sort by field',
  })
  @IsOptional()
  sortBy?: string;
  @ApiProperty({
    required: false,
    type: String,
    enum: ['asc', 'desc'],
    description: 'Sort order',
  })
  @IsOptional()
  order?: 'asc' | 'desc';
  @ApiProperty({
    required: false,
    type: String,
    description: 'Search value',
  })
  @IsOptional()
  search?: string;
  @ApiProperty({
    required: false,
    type: [String],
    description: 'Search fields',
  })
  @IsOptional()
  @Transform(({ value }) => {
    return typeof value === 'string' ? [value] : value;
  })
  searchFields?: string[];
}
