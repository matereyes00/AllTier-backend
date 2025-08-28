import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TierList } from '../../domain/entities/tier.list.entity';
import { AuthModule } from './auth.module';
import { Item } from 'src/domain/entities/item.entity';
import { CommentsService } from 'src/application/services/comments.service';
import { CommentsRepository } from '../database/repositories/comments.repository';
import { CommentsController } from '../http/controllers/comments.controller';
import { Comment } from 'src/domain/entities/comment.entity';
import { TierListRepository } from '../database/repositories/tier.list.repository';
import { Like } from 'src/domain/entities/like.entity';
import { LikeRepository } from '../database/repositories/like.repository';
import { UserRepository } from '../database/repositories/user.repository';
import { User } from 'src/domain/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, TierList, Like, Item, User]), AuthModule],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository, TierListRepository, LikeRepository, UserRepository],
  exports: [CommentsService],
})
export class CommentsModule {}
