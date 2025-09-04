import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Rating } from "../../../domain/entities/rating.entity";
import { Repository } from "typeorm";
import { CreateRatingDto } from "../../../application/dtos/Rating/create.rating.dto";
import { Item } from "src/domain/entities/item.entity";
import { User } from "src/domain/entities/user.entity";

@Injectable()
export class RatingsRepository {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingsRepository: Repository<Rating>,
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) {}

  async createAndSave(
    itemId: string,
    user: User,
    createRatingDto: CreateRatingDto,
  ): Promise<Rating> {
    // 1. Find the item that this rating will be associated with.
    const item = await this.itemsRepository.findOne({ where: { itemId } });
    if (!item) {
      throw new NotFoundException(`Item with ID "${itemId}" not found.`);
    }

    // 2. Create a new rating entity instance using the repository from the base class.
    const newRating = this.ratingsRepository.create({
      ...createRatingDto,
      item: item,        
      user: user,        
    });

    // 3. Save the new rating entity to the database.
    return this.ratingsRepository.save(newRating);
  }

}