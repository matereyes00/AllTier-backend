import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like } from "src/domain/entities/like.entity";
import { BaseRepository } from "./base.repository";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class LikeRepository extends BaseRepository<Like>{
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,
  ) {
    super(Like, dataSource)
  }

  // async findAll() {
  //     return super.findAll({ user: true, like: true, items: true, comments: true })
  // }

}