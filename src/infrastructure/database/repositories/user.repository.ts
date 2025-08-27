/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../domain/entities/user.entity';
import { CreateUserDto } from '../../../application/dtos/create-user.dto';
import { UpdateUserDto } from 'src/application/dtos/update-profile.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
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
}
