import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth.module';
import { Item } from '../../domain/entities/item.entity';
import { ItemsController } from '../http/controllers/item.controller';
import { ItemsService } from '../../application/services/item.service';
import { ItemRepository } from '../database/repositories/item.repository';
import { TierList } from '../../domain/entities/tier.list.entity';
import { UsersModule } from './users.module';
import { User } from '../../domain/entities/user.entity';
import { TierListLikesModule } from './likes.module';
import { TierListModule } from './tier.list.module';
import { CloudinaryService } from 'src/application/services/cloudinary.service';
import { RatingModule } from './rating.module';
import { Rating } from '../../domain/entities/rating.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item, TierList, User, Rating]), 
    AuthModule, 
    UsersModule, 
    TierListLikesModule,
    forwardRef(() => TierListModule),
    forwardRef(() => RatingModule)
  ],
  controllers: [ItemsController],
  providers: [ItemsService, ItemRepository, CloudinaryService],
  exports: [ItemRepository], 
})
export class ItemModule {}
