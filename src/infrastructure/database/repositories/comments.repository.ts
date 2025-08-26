import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Item } from "src/domain/entities/item.entity";
import { Repository } from "typeorm";

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectRepository(Item)
    private readonly commentsRepository: Repository<Comment>,
  ) {}

}