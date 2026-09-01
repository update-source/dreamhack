import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AuthController {
  constructor() {}

  @Get('/')
  @Render('index')
  root() {}
}
