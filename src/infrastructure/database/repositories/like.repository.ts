import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like } from "src/domain/entities/like.entity";
import { Repository } from "typeorm";

@Injectable()
export class LikeRepository {
  constructor(
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,
  ) {}

}