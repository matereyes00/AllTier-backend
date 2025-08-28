import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateCommentDto } from 'src/application/dtos/Comments/create-comment.dto';
import { CommentsService } from 'src/application/services/comments.service';
import { CurrentUser } from '../decorators/current.user.decorator';
import { User } from 'src/domain/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UpdateCommentDto } from 'src/application/dtos/Comments/update-comment.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('create-comment/:tierListId')
  createComment(
    @Param('tierListId') tierListId: string,
    @Body() createCommentDto: CreateCommentDto, 
    @CurrentUser() user: User) {
    return this.commentsService.createComment(tierListId, createCommentDto, user)
  }

  @Patch('edit-comment/:id')
  editComment(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto, 
    @CurrentUser() user: User) {
    return this.commentsService.updateComment(id, updateCommentDto, user.userId)
  }
}
