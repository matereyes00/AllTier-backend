import { Rating } from '../../domain/entities/rating.entity';
import { RatingsRepository } from '../../infrastructure/database/repositories/rating.repository';
import { User } from '../../domain/entities/user.entity';
import { ItemRepository } from 'src/infrastructure/database/repositories/item.repository';
import { CreateBulkRatingDto, CreateRatingDto } from '../dtos/Rating/create.rating.dto';
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

  /**
   * Creates multiple ratings for items within a single tier list.
   * @param tierListId The ID of the parent tier list.
   * @param user The user submitting the ratings.
   * @param ratings An array of rating data objects.
   * @returns A promise that resolves to an array of the newly created Rating entities.
   */
  async createRating(
    tierListId: string,
    user: User,
    ratings: CreateRatingDto[]
  ): Promise<Rating[]> {
    const tierList = await this.tierListRepository.findById(tierListId)
    if (!tierList) {
      throw new BadRequestException(`Tier List ${tierListId} does not exist`)
    }
    const createdRatings: Rating[] = [];
    const affectedItemIds = new Set<string>();

    // 2. Loop through each rating in the payload and create it.
    for (const ratingDto of ratings) {
      const newRating = await this.ratingRepository.createAndSave(
        ratingDto.itemId,
        user,
        ratingDto
      );
      createdRatings.push(newRating);
      affectedItemIds.add(ratingDto.itemId); // Keep track of which items were touched
    }

    // 3. After creating all ratings, update the counts for all affected items.
    //    This is more efficient than updating inside the loop.
    for (const itemId of affectedItemIds) {
      await this.itemRepository.getRatingCount(itemId);
    }

    return createdRatings;
  }
}
