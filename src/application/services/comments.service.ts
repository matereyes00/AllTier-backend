import { CommentsRepository } from "src/infrastructure/database/repositories/comments.repository";
import { ItemRepository } from "src/infrastructure/database/repositories/item.repository";

export class CommentsService {
      constructor(private readonly commentRepository: CommentsRepository) {}
}