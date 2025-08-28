/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../infrastructure/database/repositories/user.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { LoginUserDto } from '../dtos/Auth/login-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, confirmPassword } = createUserDto;

    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
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

  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
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

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'defaultSecret',
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
    });

    return { accessToken };
  }
  async logout(userId: string): Promise<void> {
    await this.userRepository.incrementLoginCount(userId);
  }
}
