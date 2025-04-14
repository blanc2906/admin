import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';

export class FindAllUserDto {
  @IsOptional()
  @ApiProperty({
    required: false,
    enum: ['true', 'false'],
    description: 'Trạng thái đang hoạt động',
  })
  @IsIn(['true', 'false'])
  isActive?: boolean;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({
    required: false,
    default: 0,
  })
  @Transform(({ value }) => value ?? 0)
  skipCount?: number = 0;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({
    required: false,
    default: 10,
  })
  @Transform(({ value }) => value ?? 10)
  maxResultCount?: number;

  @IsOptional()
  @IsNumberString()
  @IsIn(['1', '2', '3'])
  @ApiProperty({
    required: false,
    description: 'UserName = 1, Name = 2, Email = 3',
    enum: [1, 2, 3],
  })
  orderBy?: number;

  @IsOptional()
  @IsIn(['1', '2'])
  @ApiProperty({
    required: false,
    description: 'ASC=1, DESC=2',
    enum: [1, 2],
  })
  sortBy?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Lọc theo: FullName, UserName, Email, PhoneNumber',
  })
  keyword?: string;
}
