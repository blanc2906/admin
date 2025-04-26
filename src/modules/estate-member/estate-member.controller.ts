import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';

import { AddMemberDto } from './dto/add-member.dto';
import { DeleteManyMemberDto } from './dto/delete-member.dto';
import { GetAllMembersDto } from './dto/get-all-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { EstateMemberService } from './estate-member.service';

@ApiTags('Estate Member')
@Controller('estates')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EstateMemberController {
  constructor(private readonly estateMemberService: EstateMemberService) {}

  @Get(':estateId/members')
  @ApiOperation({ summary: 'Get all members of an estate' })
  async getMembers(
    @Param('estateId', ParseIntPipe) estateId: number,
    @Query() query: GetAllMembersDto,
  ) {
    return this.estateMemberService.getListMember(estateId, query);
  }

  @Post(':estateId/members')
  @ApiOperation({ summary: 'Add a new member to estate' })
  async addMember(
    @Param('estateId', ParseIntPipe) estateId: number,
    @Body() input: AddMemberDto,
  ) {
    return this.estateMemberService.addMemberToEstate(estateId, input);
  }

  @Put(':estateId/members/:memberId')
  @ApiOperation({ summary: 'Update member details' })
  async updateMember(
    @Param('estateId', ParseIntPipe) estateId: number,
    @Param('memberId', ParseIntPipe) memberId: number,
    @Body() input: UpdateMemberDto,
  ) {
    return this.estateMemberService.update(estateId, memberId, input);
  }

  @Delete(':estateId/members')
  @ApiOperation({ summary: 'Remove multiple members from estate' })
  async removeMembers(
    @Param('estateId', ParseIntPipe) estateId: number,
    @Body() input: DeleteManyMemberDto,
  ) {
    return this.estateMemberService.removeMany(estateId, input);
  }
}
