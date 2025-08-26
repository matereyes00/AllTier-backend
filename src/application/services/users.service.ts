import { User } from "src/domain/entities/user.entity";
import { UserRepository } from "src/infrastructure/database/repositories/user.repository";

export class UsersService {
      constructor(private readonly userRepository: UserRepository) {}

      async getMyProfile(user:User) {
        const user_ = await this.userRepository.findById(user.userId)
        return user_;
    }
    
}