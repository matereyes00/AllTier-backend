import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from '../../../application/services/auth.service';
import { CreateUserDto } from '../../../application/dtos/create-user.dto';
import { LoginUserDto } from '../../../application/dtos/login-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req) {
    // In a real-world scenario, you might want to implement token blacklisting.
    // For this example, we'll just send a success message.
    return { message: 'Logged out successfully' };
  }
}
