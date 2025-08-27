import { Controller } from '@nestjs/common';
import { CommentsService } from 'src/application/services/comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // TODO: post request - user comment
}
