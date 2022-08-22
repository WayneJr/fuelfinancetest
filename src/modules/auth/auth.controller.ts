import {
  Controller,
  Post,
  UseGuards,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DoesUserExist } from './guards/doesUserExist.guard';
import { UserDto } from '../users/dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
