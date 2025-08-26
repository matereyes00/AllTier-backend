import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth.module';
import { Item } from 'src/domain/entities/item.entity';
import { ItemsController } from '../http/controllers/item.controller';
import { ItemsService } from 'src/application/services/item.service';
import { ItemRepository } from '../database/repositories/item.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Item]), AuthModule],
  controllers: [ItemsController],
  providers: [ItemsService, ItemRepository],
})
export class ItemModule {}
