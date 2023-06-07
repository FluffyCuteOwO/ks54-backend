import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { schedule } from './types/data';
import { AuthGuard } from '@nestjs/passport';
import { day, weekType } from '@prisma/client';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly scheduleService: SchedulesService) {}

  @Get('/search')
  async getOne(
    @Query('day') day: day,
    @Query('groupName') groupName: string,
    @Query('weekType') weekType: weekType,
  ) {
    return this.scheduleService.getOne(day, groupName, weekType);
  }

  @Get()
  async getAll() {
    return this.scheduleService.getAll();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async setOne(@Body() schedule: schedule) {
    return this.scheduleService.setOne(schedule);
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  async deleteOne(
    @Query('day') day: day,
    @Query('groupName') groupName: string,
    @Query('weekType') weekType: weekType,
  ) {
    return this.scheduleService.deleteOne(day, groupName, weekType);
  }
}
