import { Controller, Post, Body, UseGuards, Request, Get, Param, Patch, Delete, Req } from '@nestjs/common';
import { UsersService } from 'src/application/services/users.service';
import { User } from 'src/domain/entities/user.entity';
import { CurrentUser } from '../decorators/current.user.decorator';

@Controller('user')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('me')
    getProfile(@Req() req: Request, @CurrentUser() currentUser: User) {
        return this.usersService.getMyProfile(currentUser);
    }
    
}