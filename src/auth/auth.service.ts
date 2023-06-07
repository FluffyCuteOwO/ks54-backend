import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    if (!user) throw new BadRequestException('Invalid credentials');
    if (user && (await argon2.verify(user.password, password))) {
      const payload = { username: user.username, uuid: user.uuid };
      return {
        token: this.jwtService.sign(payload),
        uuid: user.uuid,
        username: user.username,
      };
    } else {
      throw new BadRequestException('Invalid credentials');
    }
  }

  async register(username: string, password: string, code: string) {
    if (code != 'JKLDSGHBklj2#$!31245EP;GVjdbgfSD')
      throw new NotFoundException('Invalid credentials');
    const userExists = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (userExists) throw new UnauthorizedException('User already exists');
    const user = await this.prisma.user.create({
      data: {
        username,
        password: await argon2.hash(password),
      },
    });
    const payload = { username: user.username, uuid: user.uuid };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async getMe(uuid: string) {
    const db = await this.prisma.user.findUnique({
      where: {
        uuid,
      },
    });
    if (!db) throw new NotFoundException('Invalid credentials');
    return {
      uuid: db.uuid,
      username: db.username,
    };
  }
}
