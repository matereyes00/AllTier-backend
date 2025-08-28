import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateCommentDto } from 'src/application/dtos/Comments/create-comment.dto';
import { CommentsService } from 'src/application/services/comments.service';
import { CurrentUser } from '../decorators/current.user.decorator';
import { User } from 'src/domain/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('create-comment')
  createComment(@Body() createCommentDto: CreateCommentDto, @CurrentUser() user: User) {
    return this.commentsService.createComment(createCommentDto, user)
  }
}
