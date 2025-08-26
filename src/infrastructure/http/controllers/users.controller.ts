import { Controller, Post, Body, UseGuards, Request, Get, Param, Patch, Delete } from '@nestjs/common';
import { UsersService } from 'src/application/services/users.service';

@Controller('user')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    
}