/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { TierListRepository } from '../../infrastructure/database/repositories/tier.list.repository';
import { CreateTierListDto } from '../dtos/TierList/create-tier-list.dto';
import { UpdateTierListDto } from '../dtos/TierList/update-tier-list.dto';
import { User } from '../../domain/entities/user.entity';
import { TierList } from '../../domain/entities/tier.list.entity';

@Injectable()
export class TierListService {
  constructor(private readonly tierListRepository: TierListRepository) {}

  async create(
    createTierListDto: CreateTierListDto,
    user: User,
  ): Promise<TierList> {
    if (!user) {
      throw new ForbiddenException(
        'You must be logged in to create a tier list',
      );
    }
    if (!createTierListDto.tierListName) {
      throw new BadRequestException('Tier list must have a title');
    }
    try {
      return await this.tierListRepository.create(createTierListDto, user);
    } catch (err) {
      throw new BadRequestException(
        'Something went wrong while creating the tier list.',
      );
    }
  }

  // get all tier lists

  async findAllForUser(userId: string): Promise<TierList[]> {
    const tierLists = await this.tierListRepository.findAllByUserId(userId);
    if (!tierLists || tierLists.length === 0) {
      // throw new NotFoundException(`No tier lists found for user ${userId}`);
      return [];
    }
    return tierLists;
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
    if (!tierList) {
      throw new NotFoundException(`TierList with ID "${id}" not found`);
    }
    if (tierList.user.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this tier list',
      );
    }
    return this.tierListRepository.update(tierList, updateTierListDto);
  }

  async remove(id: string, userId: string): Promise<string> {
    const tierList = await this.findOne(id, userId); // findOne includes ownership check
    if (!tierList) {
      throw new NotFoundException(`TierList with ID "${id}" not found`);
    }
    if (tierList.user.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this tier list',
      );
    }
    this.tierListRepository.remove(tierList);
    return `TierList ${tierList.tierListName} (${tierList.tierListId}) removed from database`
  }

  async likeTierList(id: string, userId: string): Promise<TierList> {
    const tierList = await this.findOne(id, userId);
    if (!tierList) {
      throw new NotFoundException('Tier list not found');
    }
    return this.tierListRepository.incrementLikes(userId, tierList.tierListId);
  }
}
