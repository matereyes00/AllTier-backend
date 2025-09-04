import { ItemRepository } from '../../infrastructure/database/repositories/item.repository';
import { UpdateItemDto } from '../dtos/Items/update-item.dto';
import { Item } from '../../domain/entities/item.entity';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { TierList } from '../../domain/entities/tier.list.entity';
import { TierListRepository } from '../../infrastructure/database/repositories/tier.list.repository';
import { CreateItemDto } from '../dtos/Items/create-item.dto';

@Injectable()
export class ItemsService {
  constructor(
     private readonly tierListRepository: TierListRepository,
     private readonly itemRepository: ItemRepository
    ) {}

  async create(tierListId: string, createItemDto: CreateItemDto, photo: Express.Multer.File): Promise<Item> {
    // 1. Construct the URL based on the file's saved path
    // IMPORTANT: You must configure your server to statically serve the 'uploads' folder
    const photoUrl = `http://localhost:3000/${photo.path}`;
    createItemDto.itemName = createItemDto.itemName
    createItemDto.itemPhotoUrl = photoUrl

    const tierList = await this.tierListRepository.findById(tierListId);
    if (!tierList) {
      throw new NotFoundException(`TierList with ID "${tierListId}" not found`);
    }

    // 2. Create the new entity with the constructed URL
    const newItem = this.itemRepository.create({
      ...createItemDto,
      itemPhotoUrl: photoUrl,
      tierList, 
    });
    return await this.itemRepository.save(await newItem);
  }

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
      photoUrl?: string, // The new, optional parameter
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
      // 2. If a new photoUrl was provided, add it to the DTO before updating
      if (photoUrl) {
        updateItemDto.itemPhotoUrl = photoUrl;
      }
      return this.itemRepository.update(item, updateItemDto);
    }

  async getItemsFromATierList(tierListId: string): Promise<Item[]> {
    return this.itemRepository.findAllByTierListId(tierListId)
  }
}
