/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../../domain/entities/user.entity';
import { CreateUserDto } from '../../../application/dtos/Auth/create-user.dto';
import { UpdateUserDto } from '../../../application/dtos/update-profile.dto';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserRepository extends BaseRepository<User>{
  constructor(
    private dataSource :DataSource
  ) {
    super(User, dataSource)
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.repository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findById(userId: string): Promise<User | null> {
    return this.repository.findOne({ where: { userId } });
  }

  async create(createUserDto: CreateUserDto, hashedPassword): Promise<User> {
    const user = this.repository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.repository.save(user);
  }

  async edit(updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.repository.preload(updateUserDto);
    if (!user) throw new NotFoundException('User not found');
    return this.repository.save(user);
  }

  async incrementLoginCount(userId: string) {
    return this.repository.increment({ userId }, 'tokenVersion', 1);
  }
}
