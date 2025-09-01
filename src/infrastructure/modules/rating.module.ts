import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth.module';
import { Item } from '../../domain/entities/item.entity';
import { RatingsService } from '../../application/services/rating.service';
import { RatingsController } from '../http/controllers/rating.controller';
import { RatingsRepository } from '../database/repositories/rating.repository';
import { Rating } from '../../domain/entities/rating.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rating]), AuthModule],
  controllers: [RatingsController],
  providers: [RatingsService, RatingsRepository],
})
export class RatingModule {}
