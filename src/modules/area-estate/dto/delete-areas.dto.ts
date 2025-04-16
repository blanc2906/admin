import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, Min } from 'class-validator';

export class DeleteAreasDto {
  @ApiProperty({
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty({ message: 'List ID cannot be empty' })
  @Type(() => Number)
  ids: number[];
}
