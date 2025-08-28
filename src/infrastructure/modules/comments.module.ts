import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TierList } from '../../domain/entities/tier.list.entity';
import { AuthModule } from './auth.module';
import { Item } from 'src/domain/entities/item.entity';
import { CommentsService } from 'src/application/services/comments.service';
import { CommentsRepository } from '../database/repositories/comments.repository';
import { CommentsController } from '../http/controllers/comments.controller';
import { Comment } from 'src/domain/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), AuthModule],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository],
  exports: [CommentsService],
})
export class CommentsModule {}
