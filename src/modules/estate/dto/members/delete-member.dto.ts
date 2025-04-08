import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional } from 'class-validator';

export class DeleteMemberDto {
  @IsInt()
  @Type(() => Number)
  userId: number;
}

export class DeleteManyMemberDto {
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  ids?: number[];
}