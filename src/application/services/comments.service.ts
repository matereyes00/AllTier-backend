/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { CommentsRepository } from 'src/infrastructure/database/repositories/comments.repository';
import { CreateCommentDto } from '../dtos/Comments/create-comment.dto';
import { User } from 'src/domain/entities/user.entity';
import { Comment } from 'src/domain/entities/comment.entity';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateCommentDto } from '../dtos/Comments/update-comment.dto';
import { TierListRepository } from 'src/infrastructure/database/repositories/tier.list.repository';

@Injectable()
export class CommentsService {
  constructor(
    private readonly tierListRepository: TierListRepository,
    private readonly commentRepository: CommentsRepository,
  ) {}

  async createComment(
    tierListId: string,
    createCommentDto: CreateCommentDto,
    user: User,
  ): Promise<Comment> {
    const tierList = await this.tierListRepository.findById(tierListId);
    if (!tierList) {
      throw new NotFoundException(`TierList with id ${tierListId} not found`);
    }
    if (!user) {
      throw new ForbiddenException('You must be logged in to create a comment');
    }
    const comment = await this.commentRepository.create(
      createCommentDto,
      user,
      tierList,
    );
    try {
      return comment;
    } catch (err) {
      throw new BadRequestException(
        'Something went wrong while creating the comment.',
      );
    }
  }

  async findOne(id: string, userId: string): Promise<Comment> {
    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new NotFoundException(`Comment with ID "${id}" not found`);
    }
    if (comment.user.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this tier list',
      );
    }
    return comment;
  }

  async updateComment(
    id: string,
    updateCommentDto: UpdateCommentDto,
    userId: string,
  ): Promise<Comment> {
    const comment = await this.findOne(id, userId); // findOne includes ownership check
    if (!comment) {
      throw new NotFoundException(`Comment with ID "${id}" not found`);
    }
    if (comment.user.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this tier list',
      );
    }
    return this.commentRepository.update(comment, updateCommentDto);
  }
}
