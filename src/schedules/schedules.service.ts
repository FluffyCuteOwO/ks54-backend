import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { day, weekType } from '@prisma/client';
import { schedule } from './types/data';
import { currentDay } from 'src/utils/time';

@Injectable()
export class SchedulesService {
  constructor(private readonly prisma: PrismaService) {}

  public async getOne(day: day, groupName: string, weekType: weekType) {
    if (!day || !groupName || !weekType) throw new BadRequestException();
    const db = await this.prisma.schedule.findFirst({
      where: {
        day,
        groupName,
        weekType,
      },
    });
    return {
      groupName,
      day,
      weekType: weekType,
      items: db && db.items.length > 0 ? db.items : [],
    };
  }

  public async getAll() {
    // Проверка на смену weekType
    const wt = await this.prisma.settings.findUnique({
      where: { typeOfSetting: 'weekType' },
    });
    if (!wt)
      await this.prisma.settings.create({
        data: {
          typeOfSetting: 'weekType',
          type: 'numerator',
        },
      });
    if (currentDay() === day.Monday && wt.changed === false) {
      await this.prisma.settings.update({
        where: {
          typeOfSetting: 'weekType',
        },
        data: {
          type:
            wt.type === weekType.numerator
              ? weekType.denominator
              : weekType.numerator,
          changed: true,
        },
      });
    } else {
      await this.prisma.settings.update({
        where: {
          typeOfSetting: 'weekType',
        },
        data: {
          changed: false,
        },
      });
    }
    // Отправка запроса
    const groups = await this.prisma.group.findMany();
    const weekT = await this.prisma.settings.findUnique({
      where: { typeOfSetting: 'weekType' },
    });
    const curDate = currentDay();

    if (!curDate || !groups || !weekType)
      throw new InternalServerErrorException();
    const data = [];
    for (const group of groups) {
      const replacement = await this.prisma.replacement.findMany({
        where: {
          day: curDate,
          weekType: weekT.type,
          groupName: group.name,
        },
      });

      const schedule = await this.prisma.schedule.findMany({
        where: {
          day: curDate,
          weekType: weekT.type,
          groupName: group.name,
        },
      });

      const scheduleItems = schedule[0]?.items ? schedule[0].items : null;
      const replacementItems = replacement[0]?.items
        ? replacement[0].items
        : null;

      if (schedule[0]?.items.length > 0 || replacement[0]?.items.length > 0) {
        data.push({
          replacement: !!replacementItems,
          groupName: group.name,
          items: replacementItems ? replacementItems : scheduleItems,
        });
      }
    }
    return {
      weekType: weekT.type,
      day: currentDay(),
      data,
    };
  }

  public async setOne(schedule: schedule) {
    try {
      const db = await this.prisma.schedule.findFirst({
        where: {
          day: schedule.day,
          weekType: schedule.weekType,
          groupName: schedule.groupName,
        },
        select: {
          id: true,
        },
      });
      if (!db) {
        return await this.prisma.schedule.create({
          data: {
            groupName: schedule.groupName,
            day: schedule.day,
            weekType: schedule.weekType,
            items: schedule.items,
          },
          select: {
            id: true,
          },
        });
      } else {
        return await this.prisma.schedule.update({
          where: {
            id: db.id,
          },
          data: {
            items: schedule.items,
          },
          select: {
            id: true,
          },
        });
      }
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  public async deleteOne(day: day, groupName: string, weekType: weekType) {
    const db = await this.prisma.schedule.count({
      where: {
        day,
        groupName,
        weekType,
      },
    });

    if (db === 0) throw new NotFoundException('Такой замены нет');

    return await this.prisma.schedule.deleteMany({
      where: {
        day,
        groupName,
        weekType,
      },
    });
  }
}
