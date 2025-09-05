import { Rating } from '../../domain/entities/rating.entity';
import { RatingsRepository } from '../../infrastructure/database/repositories/rating.repository';
import { User } from '../../domain/entities/user.entity';
import { ItemRepository } from 'src/infrastructure/database/repositories/item.repository';
import { CreateRatingDto } from '../dtos/Rating/create.rating.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { TierListRepository } from 'src/infrastructure/database/repositories/tier.list.repository';
import { create } from 'domain';

@Injectable()
export class RatingsService {
  constructor(
    private readonly tierListRepository: TierListRepository,
    private readonly itemRepository: ItemRepository,
    private readonly ratingRepository: RatingsRepository
  ) {}

  async createRating(
    tierListId: string,
    itemId: string,
    user: User,
    createRatingDto: CreateRatingDto, // Use the DTO for better type safety
  ): Promise<Rating> {
    // get the item
    const tierList = await this.tierListRepository.findById(tierListId)
    if (!tierList) {
      throw new BadRequestException(`Item ${itemId} does not exist`)
    }
    const item = await this.itemRepository.findById(itemId)
    if (!item) {
      throw new BadRequestException(`Item ${itemId} does not exist`)
    }

    const rating = await this.ratingRepository.createAndSave(
      itemId,
      user,
      createRatingDto,
    );
    await this.itemRepository.getRatingCount(itemId);
    return rating
  }
}
