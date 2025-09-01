import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Item } from "src/domain/entities/item.entity";
import { TierList } from "src/domain/entities/tier.list.entity";
import { DataSource, Repository } from "typeorm";
import { BaseRepository } from "./base.repository";
import { UpdateItemDto } from "src/application/dtos/Items/update-item.dto";

@Injectable()
export class ItemRepository extends BaseRepository<Item> {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(TierList)
    private readonly tierListRepository: Repository<TierList>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {
    super(Item, dataSource)
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

}