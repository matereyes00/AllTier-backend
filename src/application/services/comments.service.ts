import { CommentsRepository } from 'src/infrastructure/database/repositories/comments.repository';
import { CreateCommentDto } from '../dtos/Comments/create-comment.dto';
import { User } from 'src/domain/entities/user.entity';
import { Comment } from 'src/domain/entities/comment.entity';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCommentDto } from '../dtos/Comments/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly commentRepository: CommentsRepository) {}

  async createComment(
    createCommentDto: CreateCommentDto,
    user: User
  ): Promise<Comment> {
    if (!user) {
      throw new ForbiddenException(
        'You must be logged in to create a comment',
      );
    }
    
    try {
      return await this.commentRepository.create(createCommentDto, user);
    } catch (err) {
      console.error('Comment creation error:', err);  // 👈 check actual error
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
