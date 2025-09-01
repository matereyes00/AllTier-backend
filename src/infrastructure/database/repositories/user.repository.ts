/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../../domain/entities/user.entity';
import { CreateUserDto } from '../../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../../application/dtos/update-profile.dto';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserRepository extends BaseRepository<User>{
  constructor(
    private dataSource :DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(User, dataSource)
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(userId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { userId } });
  }

  async create(createUserDto: CreateUserDto, hashedPassword): Promise<User> {
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async edit(updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.preload(updateUserDto);
    if (!user) throw new NotFoundException('User not found');
    return this.userRepository.save(user);
  }

  async incrementLoginCount(userId: string) {
    return this.userRepository.increment({ userId }, 'tokenVersion', 1);
  }
}
