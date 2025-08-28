import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth.module';
import { Like } from 'typeorm';
import { LikeRepository } from '../database/repositories/like.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Like])],
  providers: [LikeRepository],
  exports: [LikeRepository],
})
export class LikesModule {}
