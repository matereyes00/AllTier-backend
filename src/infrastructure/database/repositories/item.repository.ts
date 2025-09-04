import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Item } from "../../../domain/entities/item.entity";
import { TierList } from "../../../domain/entities/tier.list.entity";
import { DataSource, Repository } from "typeorm";
import { BaseRepository } from "./base.repository";
import { UpdateItemDto } from "../../../application/dtos/Items/update-item.dto";
import { Rating } from "src/domain/entities/rating.entity";
import { CreateItemDto } from "src/application/dtos/Items/create-item.dto";

@Injectable()
export class ItemRepository extends BaseRepository<Item> {

  constructor(
    private dataSource: DataSource,
    @InjectRepository(TierList)
    private readonly tierListRepository: Repository<TierList>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(Rating)
      private readonly ratingRepository: Repository<Rating>,
  ) {
    super(Item, dataSource)
  }

  async create(itemData: Partial<Item>): Promise<Item> {
    return this.itemRepository.create(itemData)
  }

  async findById(id: string): Promise<Item | null> {
    return super.findById('itemId', id);
  }

  async update(
    item: Item,
    updateItemDto: UpdateItemDto
  ): Promise<Item> {
    this.itemRepository.merge(item, updateItemDto);
    return this.itemRepository.save(item);
  }

  async save(item: Item): Promise<Item> {
    return this.itemRepository.save(item);
  }

  // ? GET 
  async findAllByTierListId(tierListId: string) {
    return super.findAllByRelationId('tierList', 'tierListId', tierListId )
  }

  // ? QUERIES
  async getRatingCount(itemId: string): Promise<any> {
    const count = await this.ratingRepository.count({
      where: {
        item: { itemId: itemId }
      }
    });
    const item = await this.findById(itemId)
    if (!item) {
      throw new BadRequestException(`Could not find item with ID: ${itemId}`);
    }
    item.ratingCount = count
    await this.itemRepository.save(item)
    return {'ratingCount': count};
  }
}