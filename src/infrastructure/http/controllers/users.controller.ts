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

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private usersRepository: UserRepository,
  ) {}

  @Get('me')
  getProfile(@CurrentUser() user: User) {
    return this.usersService.getMyProfile(user);
  }

  @Patch('me/edit-profile')
  updateProfile(@CurrentUser() user: User) {
    return this.usersRepository.edit(user)
  }
}
