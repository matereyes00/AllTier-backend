import { Body, Controller, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { RatingsService } from '../../../application/services/rating.service';
import { ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateBulkRatingDto, CreateRatingDto } from 'src/application/dtos/Rating/create.rating.dto';
import { User } from 'src/domain/entities/user.entity';
import { CurrentUser } from '../decorators/current.user.decorator';

@ApiBearerAuth()
@Controller('tier-lists/:tierListId/items/ratings/')
@UseGuards(AuthGuard('jwt'))
export class RatingsController {
  constructor(
    private readonly ratingsService: RatingsService,
  ) {}

  // create rating
  @Post('create-rating')
  @ApiOperation({ summary: 'Create a rating for the specified item' })
  @ApiParam({ name: 'itemId', description: 'The ID of the item to be rated' })
  async createRating(
    @Param('tierListId', ParseUUIDPipe) tierListId: string,
    @CurrentUser() user: User,
    @Body() body: CreateRatingDto[],
  ) {
    return this.ratingsService.createRating(tierListId, user, body);
  }
}
