import { ItemRepository } from '../../infrastructure/database/repositories/item.repository';
import { UpdateItemDto } from '../dtos/Items/update-item.dto';
import { Item } from '../../domain/entities/item.entity';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { TierList } from '../../domain/entities/tier.list.entity';
import { TierListRepository } from '../../infrastructure/database/repositories/tier.list.repository';

@Injectable()
export class ItemsService {
  constructor(
     private readonly tierListRepository: TierListRepository,
     private readonly itemRepository: ItemRepository) {}

  async findOneTierList(id: string): Promise<TierList> {
      const tierList = await this.tierListRepository.findById(id);
      if (!tierList) {
        throw new NotFoundException(`tierList with ID "${id}" not found`);
      }
      return tierList;
    }

  async findOneItem(id: string): Promise<Item> {
      const tierList = await this.itemRepository.findById(id);
      if (!tierList) {
        throw new NotFoundException(`Item with ID "${id}" not found`);
      }
      return tierList;
    }

   async updateItem(
      itemId: string,
      tierListId: string,
      userId: string,
      updateItemDto: UpdateItemDto,
    ): Promise<Item> {
      
      const tierList = await this.findOneTierList(tierListId); // findOne includes ownership check
      if (!tierList) {
        throw new NotFoundException(`TierList with ID "${tierListId}" not found`);
      }
      const item = await this.findOneItem(itemId); // findOne includes ownership check
      if (!item) {
        throw new NotFoundException(`Item with ID "${itemId}" not found`);
      }
      if (tierList.user.userId !== userId) {
        throw new ForbiddenException(
          'You do not have permission to access this tier list',
        );
      }
      return this.itemRepository.update(item, updateItemDto);
    }
}
