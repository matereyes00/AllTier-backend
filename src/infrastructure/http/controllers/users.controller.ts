/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Patch,
  Delete,
  Req,
} from '@nestjs/common';
import { UsersService } from 'src/application/services/users.service';
import { User } from 'src/domain/entities/user.entity';
import { CurrentUser } from '../decorators/current.user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRepository } from 'src/infrastructure/database/repositories/user.repository';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private usersRepository: UserRepository,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get the current logged in user details' })
  @ApiResponse({
    status: 200,
    description: 'Profile of logged in user returned.',
  })
  getProfile(@CurrentUser() user: User) {
    return this.usersService.getMyProfile(user);
  }

  @Patch('me/edit-profile')
  @ApiOperation({ summary: 'Update the current logged in user details' })
  updateProfile(@CurrentUser() user: User) {
    return this.usersRepository.edit(user);
  }
}
