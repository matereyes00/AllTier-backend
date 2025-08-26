import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth.module';
import { Rating } from 'src/domain/entities/rating.entity';
import { UsersService } from 'src/application/services/users.service';
import { UserRepository } from '../database/repositories/user.repository';
import { UsersController } from '../http/controllers/users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Rating]), AuthModule],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
})
export class UsersModule {}
