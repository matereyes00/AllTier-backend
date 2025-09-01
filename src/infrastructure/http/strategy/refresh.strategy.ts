import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import * as dotenv from 'dotenv';
import { AuthService } from '../../../application/services/auth.service';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from '../../database/repositories/user.repository';

dotenv.config();

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        private authService: AuthService,
        private usersRepository: UserRepository, 
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.REFRESH_JWT_SECRET || 'default_refresh_secret',
            passReqToCallback: true,
            ignoreExpiration: false,
        });
    }

    async validate(req: Request, payload: any): Promise<any> {
        const authHeader = req.get('Authorization') || '';
        const refreshToken = authHeader.replace('Bearer', '').trim();
        if (!refreshToken) {
            throw new UnauthorizedException('No refresh token found');
        }
        try {
            const user = await this.usersRepository.findById(payload.id);
            if (!user) {
                throw new UnauthorizedException('User not found');
            }
            // Generate the new tokens
            const { accessToken, refreshToken: refToken } = await this.authService.generateTokens(user);
            // Attach the user and new tokens to the request object
            req.user = { user, accessToken, refreshToken: refToken };
            // console.log(req.user)
            // Return the updated user object
            return req.user;
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }
    
}