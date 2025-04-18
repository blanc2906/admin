import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    ParseIntPipe,
    UseGuards,
  } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EstateMemberService } from './estate-member.service';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';   
import { DeleteManyMemberDto} from './dto/delete-member.dto';
import { GetAllMembersDto } from './dto/get-all-member.dto';

  
@ApiTags('Estate Member')
@Controller('estates')
@ApiBearerAuth()
export class EstateMemberController  {
  constructor(
    private readonly estateMemberService: EstateMemberService
  ) {}
    
  @Get(':estateId/members')
  @ApiOperation({ summary: 'Get all members of an estate' })
  async getMembers(
    @Param('estateId', ParseIntPipe) estateId: number,
    @Query() query: GetAllMembersDto
  ) {
    return this.estateMemberService.getListMember(estateId, query);
  }
  
  @Post(':estateId/members')
  @ApiOperation({ summary: 'Add a new member to estate' })
  async addMember(
    @Param('estateId', ParseIntPipe) estateId: number,
    @Body() input: AddMemberDto
  ) {
    return this.estateMemberService.addMemberToEstate(estateId, input);
  }
  
  @Put(':estateId/members/:memberId')
  @ApiOperation({ summary: 'Update member details' })
  async updateMember(
    @Param('estateId', ParseIntPipe) estateId: number,
    @Param('memberId', ParseIntPipe) memberId: number,
    @Body() input: UpdateMemberDto
  ) {
    return this.estateMemberService.update(estateId, memberId, input);
  }
  
  @Delete(':estateId/members')
  @ApiOperation({ summary: 'Remove multiple members from estate' })
  async removeMembers(
    @Param('estateId', ParseIntPipe) estateId: number,
    @Body() input: DeleteManyMemberDto
  ) {
    return this.estateMemberService.removeMany(estateId, input);
  }
  
  // @Delete(':estateId/members/:memberId')
  // @ApiOperation({ summary: 'Remove a specific member from estate' })
  // async removeMember(
  //   @Param('estateId', ParseIntPipe) estateId: number,
  //   @Param('memberId', ParseIntPipe) memberId: number
  // ) {
  //   return this.estateMemberService.remove(estateId, memberId);
  // }
}
  