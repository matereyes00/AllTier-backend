import { RatingsRepository } from "src/infrastructure/database/repositories/rating.repository";

export class RatingsService {
      constructor(private readonly itemRepository: RatingsRepository) {}
    
}