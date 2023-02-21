import { UserModel, User,Role } from '../model';
export interface NewUser{
  userName : string;
  publicKey : string;
  role : Role[];
}
export class UserRepository {
  public async create(user: User): Promise<any> {
    const createdUser = await UserModel.create(user);
    return {
      users: { ...Object.values(createdUser), data: 'hello' },
    };
  }

  public async findByName(userName: string): Promise<any> {
    return UserModel.findOne({ userName: userName });
  }
}
