/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { TierList } from '../../../domain/entities/tier.list.entity';
import { CreateTierListDto } from '../../../application/dtos/TierList/create-tier-list.dto';
import { UpdateTierListDto } from '../../../application/dtos/TierList/update-tier-list.dto';
import { User } from '../../../domain/entities/user.entity';
import { Item } from 'src/domain/entities/item.entity';
import { BaseRepository } from './base.repository';
import { Like } from 'src/domain/entities/like.entity';

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
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,
  ) {
    super(TierList, dataSource)
  }

  async create(createTierListDto: CreateTierListDto, user: User): Promise<TierList> {
    const tierList = this.tierListRepository.create({
      tierListName: createTierListDto.tierListName,
      tierListType: createTierListDto.tierListType,
      user,
      items: createTierListDto.items,
    });
    return this.tierListRepository.save(tierList);
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
    const user = await this.usersRepository.findOne({where: {userId},});
    if (!user) {
      throw new NotFoundException("User not found")
    }
    await this.tierListRepository.increment(
      { tierListId }, // condition
      "likeCount",    // column to increment
      1               // increment by 1
    );

    const updatedTierList = await this.findById(tierListId);
    if (!updatedTierList) {
      throw new NotFoundException('Tier list not found');
    }

    //create an instance of Like
    const existingLike = await this.likesRepository.findOne({
      where : {user, tierList: updatedTierList}
    })
    if (!existingLike) {
      throw new ConflictException("You can't like the same list twice");
    }
    const newLike = await this.likesRepository.save(
      this.likesRepository.create({
        user,
        tierList: updatedTierList
      })
    );
    

    return updatedTierList;
  }


}
