import { Controller, Post, Body, UseGuards, Request, Get, Param, Patch, Delete } from '@nestjs/common';
import { RatingsService } from 'src/application/services/rating.service';

@Controller('ratings')
export class RatingsController {
    constructor(private readonly ratingsService: RatingsService) {}
}