import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { TierListRepository } from '../../infrastructure/database/repositories/tier.list.repository';
import { CreateTierListDto } from '../dtos/create-tier-list.dto';
import { UpdateTierListDto } from '../dtos/update-tier-list.dto';
import { User } from '../../domain/entities/user.entity';
import { TierList } from '../../domain/entities/tier.list.entity';

@Injectable()
export class TierListService {
  constructor(private readonly tierListRepository: TierListRepository) {}

  async create(
    createTierListDto: CreateTierListDto,
    user: User,
  ): Promise<TierList> {
    return this.tierListRepository.create(createTierListDto, user);
  }

  async findAllForUser(userId: string): Promise<TierList[]> {
    return this.tierListRepository.findAllByUserId(userId);
  }

  async findOne(id: string, userId: string): Promise<TierList> {
    const tierList = await this.tierListRepository.findById(id);
    if (!tierList) {
      throw new NotFoundException(`TierList with ID "${id}" not found`);
    }
    if (tierList.user.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this tier list',
      );
    }
    return tierList;
  }

  async update(
    id: string,
    updateTierListDto: UpdateTierListDto,
    userId: string,
  ): Promise<TierList> {
    const tierList = await this.findOne(id, userId); // findOne includes ownership check
    return this.tierListRepository.update(tierList, updateTierListDto);
  }

  async remove(id: string, userId: string): Promise<void> {
    const tierList = await this.findOne(id, userId); // findOne includes ownership check
    await this.tierListRepository.remove(tierList);
  }
}
