import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth.module';
import { RatingsService } from '../../application/services/rating.service';
import { RatingsController } from '../http/controllers/rating.controller';
import { RatingsRepository } from '../database/repositories/rating.repository';
import { Rating } from '../../domain/entities/rating.entity';
import { ItemModule } from './item.module';
import { Item } from '../../domain/entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rating, Item]), 
    AuthModule,
    forwardRef(() => ItemModule),
  ],
  controllers: [RatingsController],
  providers: [RatingsService, RatingsRepository],
  exports: [RatingsRepository],
})
export class RatingModule {}
