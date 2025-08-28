/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from '../../../application/services/auth.service';
import { CreateUserDto } from '../../../application/dtos/create-user.dto';
import { LoginUserDto } from '../../../application/dtos/Auth/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../decorators/current.user.decorator';
import { User } from 'src/domain/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({
    summary:
      'This API endpoint handles user creation. The user creates an account for AllTier.',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({
    type: CreateUserDto,
    description: 'User created successfully',
  })
  @ApiConflictResponse({ description: 'User already exists' })
  @ApiBadRequestResponse({ description: 'Passwords do not match' })
  @ApiInternalServerErrorResponse({ description: '🚨 Unexpected server error' })
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'This API endpoint handles user login' })
  @ApiBody({ type: LoginUserDto })
  @ApiUnauthorizedResponse({ description: 'Invalid Credentials' })
  @ApiInternalServerErrorResponse({ description: '🚨 Unexpected server error' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'API endpoint for the user to exit their account' })
  @ApiInternalServerErrorResponse({ description: '🚨 Unexpected server error' })
  async logout(@CurrentUser() user: User) {
    await this.authService.logout(user.userId);
    return { message: 'Logged out successfully' };
  }
}
