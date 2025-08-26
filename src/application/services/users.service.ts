import { UserRepository } from "src/infrastructure/database/repositories/user.repository";

export class UsersService {
      constructor(private readonly itemRepository: UserRepository) {}
    
}