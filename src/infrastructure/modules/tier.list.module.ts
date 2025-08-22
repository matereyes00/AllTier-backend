import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TierList } from '../../domain/entities/tier.list.entity';
import { TierListController } from '../http/controllers/tier.list.controller';
import { TierListService } from '../../application/services/tier.list.service';
import { TierListRepository } from '../../infrastructure/database/repositories/tier.list.repository';
import { AuthModule } from './auth.module';
import { Item } from 'src/domain/entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TierList, Item]), AuthModule],
  controllers: [TierListController],
  providers: [TierListService, TierListRepository],
})
export class TierListModule {}
