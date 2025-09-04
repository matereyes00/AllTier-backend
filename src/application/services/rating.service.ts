import { Rating } from '../../domain/entities/rating.entity';
import { RatingsRepository } from '../../infrastructure/database/repositories/rating.repository';
import { User } from '../../domain/entities/user.entity';
import { ItemRepository } from 'src/infrastructure/database/repositories/item.repository';
import { CreateRatingDto } from '../dtos/Rating/create.rating.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RatingsService {
  constructor(
    private readonly itemRepository: ItemRepository,
    private readonly ratingRepository: RatingsRepository
  ) {}

  async createRating(
    itemId: string,
    user: User,
    createRatingDto: CreateRatingDto,
  ): Promise<Rating> {
    // 1. First, create and save the new rating itself.
    // This logic would live in your RatingRepository.
    const rating = this.ratingRepository.createAndSave(
      itemId,
      user,
      createRatingDto,
    );
    await this.itemRepository.getRatingCount(itemId);
    return rating

    // 2. CRUCIAL: After the new rating is saved, call the method
    // on the ItemRepository to recalculate and save the new count.

  }
}
