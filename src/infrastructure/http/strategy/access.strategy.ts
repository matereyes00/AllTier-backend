/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../domain/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET_KEY || 'yourSecretKey',
    });
  }

  async validate(payload: any) {
    console.log('PAYLOAD:', JSON.stringify(payload, null, 2));
    const user = await this.userRepository.findOne({
      where: { userId: payload.id },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    // You can return the whole user object or just parts of it.
    // The returned value will be attached to the request object as req.user
    const { password, ...result } = user;

    if (payload.tokenVersion !== user.tokenVersion) {
      throw new UnauthorizedException(
        'Token is no longer valid, please log in again',
      );
    }
    return result;
  }
}
