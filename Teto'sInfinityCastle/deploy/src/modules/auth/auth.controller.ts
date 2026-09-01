import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard } from 'src/vendors/guards/auth.guard';
import { AuthUser } from 'src/vendors/decorators/user.decorator';
import { RolesGuard } from 'src/vendors/guards/role.guard';
import { ROLES } from 'src/common/constants';
import { Roles } from 'src/vendors/decorators/role.decorator';
import { AddUserDto } from './dto/add-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('me')
  getUserInfo(@AuthUser() user: any) {
    return {
      username: user.username,
      password: user.hashed_pass,
      role: user.role,
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([ROLES.ADMIN])
  @Get('users')
  getAllUser() {
    return this.authService.getAllUser();
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([ROLES.ADMIN])
  @Post('')
  addUser(@Body() body: AddUserDto) {
    return this.authService.addUser(body.username, body.password);
  }
}
