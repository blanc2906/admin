import { ApiProperty } from '@nestjs/swagger';

import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteMultipleUserDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({
    example: [1],
  })
  ids: number[];
}
