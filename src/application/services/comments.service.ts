import { CommentsRepository } from 'src/infrastructure/database/repositories/comments.repository';
import { CreateCommentDto } from '../dtos/Comments/create-comment.dto';
import { User } from 'src/domain/entities/user.entity';
import { Comment } from 'src/domain/entities/comment.entity';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';

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
      return await this.commentRepository.createComment(createCommentDto, user);
    } catch (err) {
      console.error('Comment creation error:', err);  // 👈 check actual error
      throw new BadRequestException(
        'Something went wrong while creating the comment.',
      );
    }

  }

}
