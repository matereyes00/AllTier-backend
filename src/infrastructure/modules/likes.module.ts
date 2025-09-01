import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TierListLikeRepository } from '../database/repositories/like.repository';
import { TierListLike } from '../../domain/entities/like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TierListLike])],
  providers: [TierListLikeRepository],
  exports: [TierListLikeRepository],
})
export class TierListLikesModule {}
