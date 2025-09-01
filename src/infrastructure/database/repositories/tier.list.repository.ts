/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { TierList } from '../../../domain/entities/tier.list.entity';
import { CreateTierListDto } from '../../../application/dtos/TierList/create-tier-list.dto';
import { UpdateTierListDto } from '../../../application/dtos/TierList/update-tier-list.dto';
import { User } from '../../../domain/entities/user.entity';
import { Item } from 'src/domain/entities/item.entity';
import { BaseRepository } from './base.repository';
import { TierListLike } from 'src/domain/entities/like.entity';

@Injectable()
export class TierListRepository extends BaseRepository<TierList> {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(TierList)
    private readonly tierListRepository: Repository<TierList>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(TierListLike)
    private readonly likesRepository: Repository<TierListLike>,
  ) {
    super(TierList, dataSource);
  }

  // async create(
  //   createTierListDto: CreateTierListDto,
  //   user: User,
  // ): Promise<TierList> {
  //   const tierList = this.tierListRepository.create({
  //     tierListName: createTierListDto.tierListName,
  //     tierListType: createTierListDto.tierListType,
  //     user,
  //     items: createTierListDto.items,
  //   });
  //   return this.tierListRepository.save(tierList);
  // }

  async create(
    createTierListDto: CreateTierListDto,
    user: User,
  ): Promise<TierList> {
    // A transaction is still best practice for creating a parent and its children
    return this.dataSource.transaction(async (transactionalEntityManager) => {
      // 1️⃣ Create the TierList entity and directly assign the categories array
      const tierList = transactionalEntityManager.create(TierList, {
        tierListName: createTierListDto.tierListName,
        tierListType: createTierListDto.tierListType,
        thumbnailUrl: createTierListDto.thumbnailUrl,
        user,
        categories: createTierListDto.categories || [], // Directly assign the string array
      });
      await transactionalEntityManager.save(tierList);

      // 2️⃣ If there are items, create them and link them to the tier list
      if (createTierListDto.items && createTierListDto.items.length > 0) {
        const itemsToCreate = createTierListDto.items.map((itemDto) => {
          return transactionalEntityManager.create(Item, {
            itemName: itemDto.itemName,
            category: itemDto.category, // Assign category as a simple string
            tierList: tierList, // Link back to the new TierList
          });
        });
        await transactionalEntityManager.save(itemsToCreate);
      }

      // 3️⃣ Return the fully created TierList
      // Use findOneOrFail to ensure the entity was created before returning
      return transactionalEntityManager.findOneOrFail(TierList, {
        where: { tierListId: tierList.tierListId },
        relations: ['user', 'items'], // Load the items relation
      });
    });
  }

  async findById(id: string): Promise<TierList | null> {
    return super.findById('tierListId', id, { user: true });
  }

  async findAllByUserId(userId: string): Promise<TierList[]> {
    return super.findAllByUserId('user', userId, { user: true });
  }

  async update(
    tierList: TierList,
    updateTierListDto: UpdateTierListDto,
  ): Promise<TierList> {
    this.tierListRepository.merge(tierList, updateTierListDto);
    return this.tierListRepository.save(tierList);
  }

  async remove(tierList: TierList): Promise<void> {
    await this.tierListRepository.remove(tierList);
  }

  async incrementLikes(userId: string, tierListId: string): Promise<TierList> {
    // 1️⃣ Ensure the user exists
    const user = await this.usersRepository.findOne({ where: { userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2️⃣ Ensure the tier list exists
    const tierList = await this.tierListRepository.findOne({
      where: { tierListId },
      relations: ['likes'], // load likes relation to check existing likes if needed
    });
    if (!tierList) {
      throw new NotFoundException('Tier list not found');
    }

    // 3️⃣ Check if user already liked the tier list
    const existingLike = await this.likesRepository.findOne({
      where: {
        user: { userId },
        tierList: { tierListId },
      },
    });

    if (existingLike) {
      throw new ConflictException("You can't like the same list twice");
    }

    // 4️⃣ Increment likeCount
    await this.tierListRepository.increment({ tierListId }, 'likeCount', 1);

    // 5️⃣ Save the Like entity
    await this.likesRepository.save(
      this.likesRepository.create({ user, tierList }),
    );

    // 6️⃣ Return the updated tier list safely
    const updatedTierList = await this.tierListRepository.findOne({
      where: { tierListId },
      relations: ['user', 'items', 'likes', 'comments'],
    });

    if (!updatedTierList) {
      throw new NotFoundException('Tier list not found after update');
    }

    // 6️⃣ Return updated tier list
    return updatedTierList;
  }
}
