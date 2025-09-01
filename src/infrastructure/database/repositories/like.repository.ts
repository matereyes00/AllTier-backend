import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TierListLike } from '../../../domain/entities/like.entity';
import { BaseRepository } from './base.repository';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TierListLikeRepository extends BaseRepository<TierListLike> {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(TierListLike)
    private readonly likesRepository: Repository<TierListLike>,
  ) {
    super(TierListLike, dataSource);
  }

  // async findAll() {
  //     return super.findAll({ user: true, like: true, items: true, comments: true })
  // }
}
