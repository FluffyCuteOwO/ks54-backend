import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { userDto, userRegisterDto } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: userDto, @Res() res: Response) {
    const answer = await this.authService.login(body.username, body.password);
    res.cookie('token', answer.token);
    res.cookie('uuid', answer.uuid);
    return res.status(200).end();
  }

  @Post('register')
  async register(@Body() body: userRegisterDto, @Res() res: Response) {
    const answer = await this.authService.register(
      body.username,
      body.password,
      body.code,
    );
    res.cookie('token', answer.token);
    return res.status(201).end();
  }

  @Get('/@me')
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Req() req) {
    return this.authService.getMe(req.user.uuid);
  }
}
