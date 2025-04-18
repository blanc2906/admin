import { ApiProperty } from '@nestjs/swagger';

import {
  IsArray,
  IsDate,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  userName: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  fullName: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  emailAddress: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  isActive: true;

  // @ApiProperty({
  //   required: false,
  // })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roleNames?: string[];

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  homeAddress: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  addressOfBirth: string;

  @ApiProperty({
    required: false,
    example: '2000-03-10',
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({
    required: false,
    enum: ['male', 'female'],
  })
  @IsOptional()
  @IsIn(['male', 'female'])
  gender: string;

  // @ApiProperty({
  //   required: false,
  // })
  @IsOptional()
  nationality: string;

  // @ApiProperty({
  //   required: false,
  // })
  @IsOptional()
  imageUrl: string;
}
