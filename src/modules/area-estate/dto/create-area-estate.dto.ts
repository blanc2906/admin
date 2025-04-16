import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { IsString } from 'class-validator';
import { IsOptional } from 'class-validator';

export class CreateAreaEstateDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ required: false })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'ID of the estate',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  estateId: number;
}
