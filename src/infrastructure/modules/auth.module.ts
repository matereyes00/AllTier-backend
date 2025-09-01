import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../../application/services/auth.service';
import { AuthController } from '../http/controllers/auth.controller';
import { User } from '../../domain/entities/user.entity';
import { JwtStrategy } from '../http/strategy/jwt.strategy';
import { UserRepository } from '../database/repositories/user.repository';
import { ConfigModule } from '@nestjs/config';
import { RefreshTokenStrategy } from '../http/strategy/refresh.strategy';
import refreshJwtConfig from '../config/refresh-jwt.config';
import accessJwtConfig from '../config/access-jwt.config';
import { UsersModule } from './users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
        global: true,
        secret: process.env.ACCESS_TOKEN_SECRET_KEY || 'default-secret',
        signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN },
    }),
    JwtModule.register({
      global: true,
      secret: process.env.REFRESH_JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: process.env.REFRESH_JWT_EXPIRE_IN },
    }),
    ConfigModule.forFeature(refreshJwtConfig),
    ConfigModule.forFeature(accessJwtConfig),
  ],
  providers: [AuthService, JwtStrategy, RefreshTokenStrategy, UserRepository],
  controllers: [AuthController],
})
export class AuthModule {}
