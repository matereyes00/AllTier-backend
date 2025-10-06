import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentDto } from '../../../application/dtos/Comments/create-comment.dto';
import { UpdateCommentDto } from '../../../application/dtos/Comments/update-comment.dto';
import { Comment } from '../../../domain/entities/comment.entity';
import { User } from '../../../domain/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { TierList } from '../../../domain/entities/tier.list.entity';
import { CommentLike } from 'src/domain/entities/comment.like.entity';

@Injectable()
export class CommentsRepository extends BaseRepository<Comment> {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(CommentLike)
    private readonly commentLikeRepository: Repository<CommentLike>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
    super(Comment, dataSource);
  }

  create(
    createCommentDto: CreateCommentDto,
    user: User,
    tierList: TierList,
  ): Promise<Comment> {
    const comment = this.commentsRepository.create({
      commentText: createCommentDto.commentText,
      user,
      tierList,
    });
    return this.commentsRepository.save(comment);
  }

  async update(
    comment: Comment,
    updatecommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    this.commentsRepository.merge(comment, updatecommentDto);
    return this.commentsRepository.save(comment);
  }

  async remove(comment: Comment): Promise<void> {
    await this.commentsRepository.remove(comment);
  }

  async findById(id: string): Promise<Comment | null> {
    return super.findById('commentId', id, {
      user: true,
      tierList: true,
      // rating: true
    });
  }

  async findCommentBasedOnTierList(
    tierListId: string, 
    commentId: string
  ): Promise<Comment> {
    console.log(`Entered findCommentBasedOnTierList()`)
    const comment = await this.findById(commentId);
    if (!comment) {
      throw new NotFoundException(`Comment with ID "${commentId}" not found`);
    }

    if (comment.tierList.tierListId !== tierListId) {
      throw new NotFoundException(
        `Comment with ID "${commentId}" does not belong to TierList "${tierListId}"`,
      );
    }

    return comment;
  }


  // users can like comments
  async incrementCommentLikes(commentId: string, userId: string): Promise<Comment | null> {
    console.log("Entered incrementCommentLikes() of commentsRepo")
    // 1️⃣ Ensure the user exists
    const user = await this.usersRepository.findOne({ where: { userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    // getting the current comment
    const comment = await this.commentsRepository.findOne({
      where: {commentId},
      relations: ['commentLikes']
    })
    if (!comment) {
      throw new NotFoundException(`Comment not found`)
    }

    // Check if user already liked the tier list
    const existingLike = await this.commentLikeRepository.findOne({
      where: {
        user: { userId },
        comment: { commentId },
      },
    });
    if (existingLike) {
      throw new ConflictException("You can't like the same comment twice");
    }

    
    await this.repository.increment({ commentId }, 'likeCount', 1);
    await this.commentLikeRepository.save(
      this.commentLikeRepository.create({user, comment})
    )

    const updatedComment = await this.repository.findOne({
      where: { commentId },
      relations: ['user', 'commentLikes'],
    });
    if (!updatedComment) {
      throw new NotFoundException('Tier list not found after update');
    }

    return updatedComment
  }

}
