import { CommentsRepository } from 'src/infrastructure/database/repositories/comments.repository';

export class CommentsService {
  constructor(private readonly commentRepository: CommentsRepository) {}
}
