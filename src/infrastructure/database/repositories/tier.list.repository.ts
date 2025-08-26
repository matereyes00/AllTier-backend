import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TierList } from '../../../domain/entities/tier.list.entity';
import { CreateTierListDto } from '../../../application/dtos/create-tier-list.dto';
import { UpdateTierListDto } from '../../../application/dtos/update-tier-list.dto';
import { User } from '../../../domain/entities/user.entity';
import { Item } from 'src/domain/entities/item.entity';

@Injectable()
export class TierListRepository {
  constructor(
    @InjectRepository(TierList)
    private readonly tierListRepository: Repository<TierList>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  create(createTierListDto: CreateTierListDto, user: User): Promise<TierList> {
    const tierList = this.tierListRepository.create({
      tierListName: createTierListDto.tierListName,
      tierListType: createTierListDto.tierListType,
      user,
      items: createTierListDto.items,
    });
    return this.tierListRepository.save(tierList);
  }

  findAllByUserId(userId: string): Promise<TierList[]> {
    return this.tierListRepository.find({
      where: { user: { userId } },
      relations: ['user'], // Optional: include user data in the response
    });
  }

  findById(id: string): Promise<TierList | null> {
    return this.tierListRepository.findOne({
      where: { tierListId: id },
      relations: ['user'],
    });
  }

  async update(tierList: TierList, updateTierListDto: UpdateTierListDto): Promise<TierList> {
    this.tierListRepository.merge(tierList, updateTierListDto);
    return this.tierListRepository.save(tierList);
  }

  async remove(tierList: TierList): Promise<void> {
    await this.tierListRepository.remove(tierList);
  }
}
