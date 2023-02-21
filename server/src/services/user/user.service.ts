import { UserRepository } from '../../shared/database/repository';
import { User } from '../../shared/database/model';
export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async getList(): Promise<string>{
    return 'hello';
  }
}
