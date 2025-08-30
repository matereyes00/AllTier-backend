import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeRepository } from '../database/repositories/like.repository';
import { TierListLike } from 'src/domain/entities/like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TierListLike])],
  providers: [LikeRepository],
  exports: [LikeRepository],
})
export class LikesModule {}
