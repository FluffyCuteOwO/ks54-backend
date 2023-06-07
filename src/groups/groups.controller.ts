import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupService: GroupsService) {}

  @Get()
  async getAllGroups() {
    return this.groupService.getGroups();
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  async deleteGroup(@Query('groupName') groupName: string) {
    return this.groupService.deleteGroup(groupName);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async addGroup(@Body() body: { groupName: string }) {
    return this.groupService.addGroup(body.groupName);
  }
}
