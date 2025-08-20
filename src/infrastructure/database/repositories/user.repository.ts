import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../domain/entities/user.entity';
import { CreateUserDto } from '../../../application/dtos/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly ormRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.ormRepository.findOne({ where: { username } });
  }

  async findById(userId: string): Promise<User | null> {
    return this.ormRepository.findOne({ where: { userId } });
  }

  async create(createUserDto: CreateUserDto, hashedPassword): Promise<User> {
    const user = this.ormRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.ormRepository.save(user);
  }
}
