import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, IsNumber, IsOptional } from 'class-validator';

export class DeleteMemberDto {
  @ApiProperty({
    required: true,
  })
  @IsInt()
  @Type(() => Number)
  userId: number;
}

export class DeleteManyMemberDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({
      example: [1],
    })
  ids?: number[];
}