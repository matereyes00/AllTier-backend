import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Rating } from "src/domain/entities/rating.entity";
import { Repository } from "typeorm";

@Injectable()
export class RatingsRepository {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingsRepository: Repository<Rating>,
  ) {}

}