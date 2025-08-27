import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TierListService } from '../../../application/services/tier.list.service';
import { CreateTierListDto } from '../../../application/dtos/create-tier-list.dto';
import { UpdateTierListDto } from '../../../application/dtos/update-tier-list.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CurrentUser } from '../decorators/current.user.decorator';
import { User } from 'src/domain/entities/user.entity';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('tierlists')
export class TierListController {
  constructor(private readonly tierListService: TierListService) {}

  @Post('create-tier-list')
  @ApiOperation({
    summary: 'Create a tier list for the logged in user',
  })
  @ApiBody({ type: CreateTierListDto })
  @ApiInternalServerErrorResponse({ description: '🚨 Unexpected server error' })
  create(
    @Body() createTierListDto: CreateTierListDto,
    @CurrentUser() user: User,
  ) {
    return this.tierListService.create(createTierListDto, user);
  }

  @Get('my-tier-lists')
  @ApiOperation({
    summary: 'Get all tier lists for the logged in user',
  })
  @ApiInternalServerErrorResponse({ description: '🚨 Unexpected server error' })
  findAllForUser(@CurrentUser() user: User) {
    return this.tierListService.findAllForUser(user.userId);
  }

  @Get('my-tier-list/:id')
  @ApiOperation({
    summary: 'Get a specific tier list owned by the logged in user',
  })
  @ApiInternalServerErrorResponse({ description: '🚨 Unexpected server error' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tierListService.findOne(id, user.userId);
  }

  @Patch('update-tier-list/:id')
  @ApiOperation({
    summary: 'Update a tier list for the current logged in user',
  })
  @ApiInternalServerErrorResponse({ description: '🚨 Unexpected server error' })
  update(
    @Param('id') id: string,
    @Body() updateTierListDto: UpdateTierListDto,
    @CurrentUser() user: User,
  ) {
    return this.tierListService.update(id, updateTierListDto, user.userId);
  }

  @Delete('remove-tier-list/:id')
  @ApiOperation({
    summary: 'Delete a tier list for the current logged in user',
  })
  @ApiInternalServerErrorResponse({ description: '🚨 Unexpected server error' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tierListService.remove(id, user.userId);
  }
}
