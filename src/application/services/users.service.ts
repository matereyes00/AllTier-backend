import { User } from 'src/domain/entities/user.entity';
import { UserRepository } from 'src/infrastructure/database/repositories/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async getMyProfile(user: User) {
    const user_ = await this.userRepository.findById(user.userId);
    return user_;
  }

  async incrementLoginCount(userId: string) {
    await this.userRepository.incrementLoginCount(userId);
  }
}
