import { UserRepository } from '../../shared/database/repository';

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async getList(): Promise<string> {
    return this.userRepository.getList();
  }
}
