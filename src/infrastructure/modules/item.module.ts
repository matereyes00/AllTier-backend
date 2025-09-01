import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth.module';
import { Item } from 'src/domain/entities/item.entity';
import { ItemsController } from '../http/controllers/item.controller';
import { ItemsService } from 'src/application/services/item.service';
import { ItemRepository } from '../database/repositories/item.repository';
import { TierList } from 'src/domain/entities/tier.list.entity';
import { TierListRepository } from '../database/repositories/tier.list.repository';
import { UsersModule } from './users.module';
import { User } from 'src/domain/entities/user.entity';
import { TierListLikesModule } from './likes.module';
import { TierListModule } from './tier.list.module';
import { TierListLikeRepository } from '../database/repositories/like.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Item, TierList, User]), 
    AuthModule, 
    UsersModule, 
    TierListLikesModule,
    forwardRef(() => TierListModule)
  ],
  controllers: [ItemsController],
  providers: [ItemsService, ItemRepository],
})
export class ItemModule {}
