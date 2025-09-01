import { Controller } from '@nestjs/common';
import { RatingsService } from '../../../application/services/rating.service';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  // create rating
}
