import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { replacement } from './types/data';
import { currentDay } from '../utils/time';
import { day, weekType } from '@prisma/client';

@Injectable()
export class ReplacementsService {
  constructor(private readonly prisma: PrismaService) {}

  public async getOne(replacement: replacement) {
    if (!replacement.day || !replacement.groupName || !replacement.weekType)
      throw new BadRequestException();
    const db = await this.prisma.replacement.findFirst({
      where: {
        day: replacement.day,
        weekType: replacement.weekType,
        groupName: replacement.groupName,
      },
    });
    return {
      groupName: replacement.groupName,
      day: replacement.day,
      weekType: replacement.weekType,
      items: db && db.items.length > 0 ? db.items : [],
    };
  }

  public async getAll() {
    return this.prisma.replacement.findMany({
      where: {
        day: currentDay(),
        weekType: (
          await this.prisma.settings.findUnique({
            where: {
              typeOfSetting: 'weekType',
            },
          })
        ).type,
      },
    });
  }

  public async setOne(replacement: replacement) {
    const db = await this.prisma.replacement.findFirst({
      where: {
        day: replacement.day,
        weekType: replacement.weekType,
        groupName: replacement.groupName,
      },
      select: {
        id: true,
      },
    });
    if (!db) {
      return await this.prisma.replacement.create({
        data: {
          groupName: replacement.groupName,
          day: replacement.day,
          weekType: replacement.weekType,
          items: replacement.items,
        },
      });
    } else {
      return await this.prisma.replacement.update({
        where: {
          id: db.id,
        },
        data: {
          items: replacement.items,
        },
      });
    }
  }

  public async deleteOne(day: day, groupName: string, weekType: weekType) {
    const db = await this.prisma.replacement.count({
      where: {
        day,
        groupName,
        weekType,
      },
    });

    if (db === 0) throw new NotFoundException('Такой замены нет');

    return await this.prisma.replacement.deleteMany({
      where: {
        day,
        groupName,
        weekType,
      },
    });
  }
}
