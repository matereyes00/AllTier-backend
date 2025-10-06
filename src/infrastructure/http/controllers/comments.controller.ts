/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateCommentDto } from '../../../application/dtos/Comments/create-comment.dto';
import { CommentsService } from '../../../application/services/comments.service';
import { CurrentUser } from '../decorators/current.user.decorator';
import { User } from '../../../domain/entities/user.entity';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UpdateCommentDto } from '../../../application/dtos/Comments/update-comment.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('create-comment/:tierListId')
  @ApiOperation({
    summary:
      'The logged in user can create a comment for a specific tier list.',
  })
  @ApiBody({ type: CreateCommentDto })
  @ApiNotFoundResponse({
    description: `Tier list with ID not found`,
  })
  @ApiForbiddenResponse({
    description: 'You must be logged in to create a comment',
  })
  @ApiBadRequestResponse({
    description: 'Something went wrong in creating the comment',
  })
  @ApiInternalServerErrorResponse({ description: '🚨 Unexpected server error' })
  createComment(
    @Param('tierListId') tierListId: string,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.createComment(
      tierListId,
      createCommentDto,
      user,
    );
  }

  @Patch('edit-comment/:id')
  @ApiOperation({
    summary:
      'The logged in user can update a comment they left for a specific tier list.',
  })
  @ApiBody({ type: UpdateCommentDto })
  @ApiNotFoundResponse({
    description: `Comment with ID not found`,
  })
  @ApiForbiddenResponse({
    description: 'You have no permission to access to update this comment',
  })
  editComment(
    @Param('id') id: string, // comment id
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.updateComment(
      id,
      updateCommentDto,
      user.userId,
    );
  }

  @Delete('remove-comment/:id')
  @ApiOperation({
    summary: 'Delete a tier list for the current logged in user',
  })
  @ApiNotFoundResponse({ description: 'Tier List not found' })
  @ApiForbiddenResponse({
    description: '⚠️ User has no permissions to access this tier list',
  })
  @ApiInternalServerErrorResponse({ description: '🚨 Unexpected server error' })
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.commentsService.removeComment(id, user.userId);
  }


  @Patch(':tierListId/like-comment/:commentId')
  async likeComment(
    @Param('tierListId') tierListId: string, 
    @Param('commentId') commentId: string, 
    @CurrentUser() user: User) {
      console.log(`Entered likeComment() in comments controller`)
      console.log(user.userId)
      return this.commentsService.likeComment(tierListId, commentId, user.userId)
    }

}
