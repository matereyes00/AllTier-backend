import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Rating } from "../../../domain/entities/rating.entity";
import { Repository, DataSource } from "typeorm";
import { CreateRatingDto } from "../../../application/dtos/Rating/create.rating.dto";
import { Item } from "src/domain/entities/item.entity";
import { User } from "src/domain/entities/user.entity";
import { BaseRepository } from "./base.repository";

@Injectable()
export class RatingsRepository extends BaseRepository<Rating> {
  constructor(
    dataSource: DataSource,
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) {
    super(Rating, dataSource)
  }

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
    const newRating = this.repository.create({
      ...createRatingDto,
      item: item,        
      user: user,        
    });

    // 3. Save the new rating entity to the database.
    return this.repository.save(newRating);
  }

}