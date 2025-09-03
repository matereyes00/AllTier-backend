/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../infrastructure/database/repositories/user.repository';
import { CreateUserDto } from '../dtos/Auth/create-user.dto';
import { LoginUserDto } from '../dtos/Auth/login-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, confirmPassword, email } = createUserDto;

    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const existingEmail = await this.userRepository.findByEmail(email);
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create(
      createUserDto,
      hashedPassword,
    );
    // delete user.password;
    return user;
  }

  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string, refreshToken: string }> {
    const { username, password } = loginUserDto;
    const user = await this.userRepository.findByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      username: user.username,
      sub: user.userId,
      tokenVersion: user.tokenVersion,
    };

    const { accessToken, refreshToken } = await this.generateTokens(user);
    delete (user as any).password;
    return { accessToken, refreshToken };
  }

  async logout(userId: string): Promise<void> {
    await this.userRepository.incrementLoginCount(userId);
  }

  async generateTokens(user: User) {
    const payload = {id: user.userId, email: user.email, tokenVersion: user.tokenVersion}
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET_KEY || 'defaultSecret',
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
          secret: process.env.REFRESH_JWT_SECRET,
          expiresIn: process.env.REFRESH_JWT_EXPIRE_IN,
      })
    return { accessToken, refreshToken };
  }

  async validateRefreshToken(userId: string, refreshToken: string) {
      try {
          // Verify the refresh token with JwtService
          const decoded = this.jwtService.verify(refreshToken, {
              secret: process.env.REFRESH_JWT_SECRET,
          });
          // Check if the decoded token corresponds to the correct user
          if (decoded.id !== userId) {
              throw new UnauthorizedException('Invalid refresh token.');
          }
          const user = await this.userRepository.findById(userId);
          if (!user) {
              throw new UnauthorizedException('User not found.');
          }
          // If the token is valid, generate new access and refresh tokens
          const { accessToken, refreshToken: refreshToken_ } =
              await this.generateTokens(user);
          return { user, accessToken, refreshToken_ };
      } catch (err) {
          console.error('Error validating refresh token:', err);
          throw new UnauthorizedException(
              'Invalid refresh token or expired.',
          );
      }
  }


}
