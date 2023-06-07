import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class GroupsService {
  constructor(private readonly prisma: PrismaService) {}

  async getGroups() {
    const data = await this.prisma.group.findMany().then((data) => data);
    if (data) {
      return data.map((group) => group.name);
    } else {
      throw new NotFoundException('We could not find any groups');
    }
  }

  async addGroup(groupName: string) {
    const exist = await this.prisma.group.findUnique({
      where: {
        name: groupName,
      },
      select: {
        id: true,
      },
    });

    if (exist) throw new BadRequestException('This groups already exists');

    return this.prisma.group.create({
      data: {
        name: groupName,
      },
    });
  }

  async deleteGroup(groupName: string) {
    const data = await this.prisma.group.findUnique({
      where: {
        name: groupName,
      },
      select: {
        id: true
      }
    });

    if (!data) throw new NotFoundException('We could not find this groups');

    return this.prisma.group.delete({
      where: {
        name: groupName,
      },
    });
  }
}
