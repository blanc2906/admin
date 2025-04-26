import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNumber } from 'class-validator';


export class DeleteManyMemberDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({
    description: 'Danh sách ID của các thành viên cần xóa',
    example: [1, 2, 3],
    type: [Number],
    isArray: true
  })
  ids: number[];
}