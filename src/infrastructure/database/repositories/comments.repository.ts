import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateCommentDto } from "src/application/dtos/Comments/create-comment.dto";
import { UpdateCommentDto } from "src/application/dtos/Comments/update-comment.dto";
import { Comment } from "src/domain/entities/comment.entity";
import { User } from "src/domain/entities/user.entity";
import { DataSource, Repository } from "typeorm";
import { BaseRepository } from "./base.repository";
import { TierList } from "src/domain/entities/tier.list.entity";

@Injectable()
export class CommentsRepository extends BaseRepository<Comment> {
  constructor(
    private dataSource : DataSource,
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
  ) {
    super(Comment, dataSource)
  }

  create(
    createCommentDto: CreateCommentDto, 
    user: User,
    tierList: TierList
  ): Promise<Comment> {
    const comment = this.commentsRepository.create({
      commentText: createCommentDto.commentText,
      user,
      tierList
    })
    return this.commentsRepository.save(comment)
  }

  async update(
    comment:Comment,
    updatecommentDto: UpdateCommentDto
  ): Promise<Comment> {
    this.commentsRepository.merge(comment, updatecommentDto);
    return this.commentsRepository.save(comment)
  }

  async findById(id: string): Promise<Comment | null> {
    return super.findById('commentId', id, { 
      user: true,
      tierList: true,
      rating: true
    });
  }

}