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
  
  import { BaseController } from '@base/controllers/p-base.controller';
  import { BQueryParams } from '@base/dto/base.dto';
  
;
  import { EstateMemberService } from './estate-member.service';
  
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';   
import { DeleteManyMemberDto, DeleteMemberDto } from './dto/delete-member.dto';
import { GetAllMembersDto } from './dto/estate-member.dto';
import { UpdateStatusMemberDto } from './dto/update-member.dto';
  
  @ApiTags('Estate Member')
  @Controller('members')
  @ApiBearerAuth()
  export class EstateMemberController  {
    constructor(
      private readonly estateMemberService: EstateMemberService
    ) {
    }
  
    // Estate Member
    @Get(':estateId')
    @ApiOperation({ summary: 'Get all members of an estate' })
    async getMembers(
      @Param('estateId', ParseIntPipe) estateId: number,
      @Query() query: GetAllMembersDto
    ) {
      return this.estateMemberService.getListMember(estateId, query);
    }
  
    @Post(':estateId')
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
  
    @Put(':estateId/members/:memberId/status')
    @ApiOperation({ summary: 'Update member status' })
    async updateMemberStatus(
      @Param('estateId', ParseIntPipe) estateId: number,
      @Param('memberId', ParseIntPipe) memberId: number,
      @Body() input: UpdateStatusMemberDto
    ) {
      return this.estateMemberService.updateStatus(estateId, memberId, input);
    }
  
    @Delete(':estateId/members/:memberId')
    @ApiOperation({ summary: 'Remove a member from estate' })
    async removeMember(
      @Param('estateId', ParseIntPipe) estateId: number,
      @Body() input: DeleteMemberDto
    ) {
      return this.estateMemberService.remove(estateId, input);
    }
  
    @Delete(':estateId')
    @ApiOperation({ summary: 'Remove multiple members from estate' })
    async removeMembers(
      @Param('estateId', ParseIntPipe) estateId: number,
      @Body() input: DeleteManyMemberDto
    ) {
      return this.estateMemberService.removeMany(estateId, input);
    }
  }
  