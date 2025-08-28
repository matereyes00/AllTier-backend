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
import { CreateTierListDto } from '../../../application/dtos/TierList/create-tier-list.dto';
import { UpdateTierListDto } from '../../../application/dtos/TierList/update-tier-list.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CurrentUser } from '../decorators/current.user.decorator';
import { User } from 'src/domain/entities/user.entity';

@ApiBearerAuth()
@Controller('tierlists')
@UseGuards(AuthGuard('jwt'))
export class TierListController {
  constructor(private readonly tierListService: TierListService) {}

  @Post('create-tier-list')
  @ApiOperation({
    summary: 'Create a tier list for the logged in user',
  })
  @ApiBody({ type: CreateTierListDto })
  @ApiForbiddenResponse({
    description: 'You must be logged in to create a tier list',
  })
  @ApiBadRequestResponse({ description: 'Tier list must have a title' })
  @ApiInternalServerErrorResponse({ description: '🚨 Unexpected server error' })
  async create(
    @Body() createTierListDto: CreateTierListDto,
    @CurrentUser() user: User,
  ) {
    return this.tierListService.create(createTierListDto, user);
  }

  @Get('my-tier-lists')
  @ApiOperation({
    summary: 'Get all tier lists for the logged in user',
  })
  @ApiNotFoundResponse({
    description: 'No tier lists found for the logged in user',
  })
  @ApiInternalServerErrorResponse({ description: '🚨 Unexpected server error' })
  async findAllForUser(@CurrentUser() user: User) {
    var tierLists = await this.tierListService.findAllForUser(user.userId);
    return {
      message: tierLists.length ? 'Tier lists found' : 'No tier lists found',
      data: tierLists,
    };
  }

  @Get('my-tier-list/:id')
  @ApiOperation({
    summary: 'Get a specific tier list owned by the logged in user',
  })
  @ApiNotFoundResponse({ description: 'Tier List not found' })
  @ApiForbiddenResponse({
    description: '⚠️ User has no permissions to access this tier list',
  })
  @ApiInternalServerErrorResponse({ description: '🚨 Unexpected server error' })
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tierListService.findOne(id, user.userId);
  }

  @Patch('update-tier-list/:id')
  @ApiOperation({
    summary: 'Update a tier list for the current logged in user',
  })
  @ApiNotFoundResponse({ description: 'Tier List not found' })
  @ApiForbiddenResponse({
    description: '⚠️ User has no permissions to access this tier list',
  })
  @ApiInternalServerErrorResponse({ description: '🚨 Unexpected server error' })
  async update(
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
  @ApiNotFoundResponse({ description: 'Tier List not found' })
  @ApiForbiddenResponse({
    description: '⚠️ User has no permissions to access this tier list',
  })
  @ApiInternalServerErrorResponse({ description: '🚨 Unexpected server error' })
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tierListService.remove(id, user.userId);
  }
}
