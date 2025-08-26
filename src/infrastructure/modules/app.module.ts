import { Module } from '@nestjs/common';
import { AppController } from '../http/controllers/app.controller';
import { AppService } from '../../application/services/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth.module';
import { TierListModule } from './tier.list.module';
import { dataSourceOptions } from '../database/data.source'
import { RatingModule } from './rating.module';
import { ItemModule } from './item.module';
import { CommentsModule } from './comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    TierListModule, ItemModule,
    RatingModule, CommentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}