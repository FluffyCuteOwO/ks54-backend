import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReplacementsService } from './replacements.service';
import { replacement } from './types/data';
import { AuthGuard } from '@nestjs/passport';
import { day, weekType } from '@prisma/client';

@Controller('replacements')
export class ReplacementsController {
  constructor(private readonly replacementService: ReplacementsService) {}

  @Get('/search')
  async getOne(
    @Query('day') day: day,
    @Query('groupName') groupName: string,
    @Query('weekType') weekType: weekType,
  ) {
    return this.replacementService.getOne({ groupName, day, weekType });
  }

  @Get()
  async getAll() {
    return this.replacementService.getAll();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async setOne(@Body() replacement: replacement) {
    return this.replacementService.setOne(replacement);
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  async deleteOne(
    @Query('day') day: day,
    @Query('groupName') groupName: string,
    @Query('weekType') weekType: weekType,
  ) {
    return this.replacementService.deleteOne(day, groupName, weekType);
  }
}
