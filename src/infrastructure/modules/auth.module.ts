import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../../application/services/auth.service';
import { AuthController } from '../http/controllers/auth.controller';
import { User } from '../../domain/entities/user.entity';
import { AccessTokenStrategy } from '../http/strategy/access.strategy';
import { UserRepository } from '../database/repositories/user.repository';
import { ConfigModule } from '@nestjs/config';
import { RefreshTokenStrategy } from '../http/strategy/refresh.strategy';
import { UsersModule } from './users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([User]),
    PassportModule,
    ConfigModule,
    JwtModule.register({}),
  ],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy, UserRepository],
  controllers: [AuthController],
})
export class AuthModule {}
