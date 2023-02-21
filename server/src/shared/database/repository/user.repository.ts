import { UserModel, User, Role } from '../model';
export interface NewUser {
  userName: string;
  publicKey: string;
  role: Role[];
}
export class UserRepository {
  public async create(user: User): Promise<User> {
    return UserModel.create(user);
  }

  public async findByName(userName: string): Promise<User | null> {
    return UserModel.findOne({ userName: userName });
  }
}
