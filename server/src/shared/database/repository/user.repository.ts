import { UserModel,User } from "../model";
export class UserRepository {

  public async getList(): Promise<User[]> {
    return UserModel.find({});
  }
}
