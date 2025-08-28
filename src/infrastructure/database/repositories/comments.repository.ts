import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateCommentDto } from "src/application/dtos/Comments/create-comment.dto";
import { Comment } from "src/domain/entities/comment.entity";
import { User } from "src/domain/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
  ) {}

  createComment(createCommentDto: CreateCommentDto, user: User): Promise<Comment> {
    const comment = this.commentsRepository.create({
      commentText: createCommentDto.commentText,
      user
    })
    return this.commentsRepository.save(comment)
  }

}