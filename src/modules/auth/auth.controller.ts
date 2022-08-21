import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DoesUserExist } from './guards/doesUserExist.guard';
import { UserDto } from '../users/dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.CREATED)
  @Post('login')
  async login(@Body() user: { email: string; password: string }) {
    return await this.authService.login(user);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(DoesUserExist)
  @Post('signup')
  async signUp(@Body() user: UserDto) {
    return await this.authService.create(user);
  }
}
