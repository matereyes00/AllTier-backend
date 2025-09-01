import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth.module';
import { UsersService } from 'src/application/services/users.service';
import { UserRepository } from '../database/repositories/user.repository';
import { UsersController } from '../http/controllers/users.controller';
import { User } from 'src/domain/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
