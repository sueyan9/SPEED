import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() userData: any) {
    return this.usersService.register(userData);
  }

  @Post('login')
  async login(@Body() loginData: any) {
    const result = await this.usersService.login(loginData);
    if (result instanceof Error) {
      throw result;
    }
    if (result instanceof Error) {
      throw new Error('An error occurred during login.');
    }
    return result;
  }
}
