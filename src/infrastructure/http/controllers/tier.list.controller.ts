import { Controller, Post, Body, UseGuards, Request, Get, Param, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TierListService } from '../../../application/services/tier.list.service';
import { CreateTierListDto } from '../../../application/dtos/create-tier-list.dto';
import { UpdateTierListDto } from '../../../application/dtos/update-tier-list.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('tierlists')
export class TierListController {
  constructor(private readonly tierListService: TierListService) {}

  @Post('create-tier-list')
  create(@Body() createTierListDto: CreateTierListDto, @Request() req) {
    // req.user is attached by the JwtStrategy
    return this.tierListService.create(createTierListDto, req.user);
  }

  @Get()
  findAllForUser(@Request() req) {
    return this.tierListService.findAllForUser(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.tierListService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTierListDto: UpdateTierListDto, @Request() req) {
    return this.tierListService.update(id, updateTierListDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.tierListService.remove(id, req.user.userId);
  }
}
