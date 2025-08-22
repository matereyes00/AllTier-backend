import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TierList } from '../../../domain/entities/tier.list.entity';
import { CreateTierListDto } from '../../../application/dtos/create-tier-list.dto';
import { UpdateTierListDto } from '../../../application/dtos/update-tier-list.dto';
import { User } from '../../../domain/entities/user.entity';

@Injectable()
export class TierListRepository {
  constructor(
    @InjectRepository(TierList)
    private readonly ormRepository: Repository<TierList>,
  ) {}

  create(createTierListDto: CreateTierListDto, user: User): Promise<TierList> {
    const tierList = this.ormRepository.create({
      ...createTierListDto,
      user,
    });
    return this.ormRepository.save(tierList);
  }

  findAllByUserId(userId: string): Promise<TierList[]> {
    return this.ormRepository.find({
      where: { user: { userId } },
      relations: ['user'], // Optional: include user data in the response
    });
  }

  findById(id: string): Promise<TierList | null> {
    return this.ormRepository.findOne({
      where: { tierListId: id },
      relations: ['user'],
    });
  }

  async update(tierList: TierList, updateTierListDto: UpdateTierListDto): Promise<TierList> {
    this.ormRepository.merge(tierList, updateTierListDto);
    return this.ormRepository.save(tierList);
  }

  async remove(tierList: TierList): Promise<void> {
    await this.ormRepository.remove(tierList);
  }
}
