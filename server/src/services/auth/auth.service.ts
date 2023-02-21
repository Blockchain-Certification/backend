import { UserRepository } from '../../shared/database/repository';
import { User } from '../../shared/database/model';
import { BadRequestError } from '../../shared/core/apiError';
import bcrypt from 'bcrypt';

export default class AuthService {
  private userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async register(user : User) {
    const userExisted = await this.userRepository.findByName(user.userName);
    if (userExisted) throw new BadRequestError('User exists already');
    const passwordHash = await bcrypt.hash(user.password, 12);
    user.password = passwordHash;
    await this.userRepository.create(user);
  }
}
