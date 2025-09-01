import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TierList } from '../../domain/entities/tier.list.entity';
import { TierListController } from '../http/controllers/tier.list.controller';
import { TierListService } from '../../application/services/tier.list.service';
import { TierListRepository } from '../../infrastructure/database/repositories/tier.list.repository';
import { AuthModule } from './auth.module';
import { Item } from '../../domain/entities/item.entity';
import { User } from '../../domain/entities/user.entity';
import { TierListLike } from '../../domain/entities/like.entity';
import { TierListLikesModule } from './likes.module';
import { ItemModule } from './item.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TierList, Item, User, TierListLike]),
    AuthModule,
    TierListLikesModule,
    forwardRef(() => ItemModule)
  ],
  controllers: [TierListController],
  providers: [TierListService, TierListRepository],
  exports: [TierListRepository]
})
export class TierListModule {}
