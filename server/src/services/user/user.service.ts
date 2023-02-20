import { UserRepository } from '../../shared/database/repository';
import { User } from '../../shared/database/model';
import asyncHandler from '../../shared/helpers/asyncHandler';
export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async getList(): Promise<User[]>{
    return this.userRepository.getList();
  }
}
