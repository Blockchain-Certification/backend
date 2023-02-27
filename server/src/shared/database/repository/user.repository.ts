import { UserModel, User, Role } from '../model';
import { argsGetList } from '../../../services/user/user.service';
import { Types } from 'mongoose';
export interface NewUser {
  userName: string;
  publicKey: string;
  role: Role[];
}
export class UserRepository {
  public async create(user: User): Promise<User> {
    return UserModel.create(user);
  }

  public async findByUserName(userName: string): Promise<User | null> {
    return UserModel.findOne({ userName: userName });
  }

  public async findById(id: string): Promise<User | null> {
    return UserModel.findById(id);
  }
  public async find(page: number, limit: number): Promise<User[]> {
    const data = await UserModel.find({
      roles: { $nin: ['DOET'] },
    })
      .skip(limit * (page - 1))
      .limit(limit)
      .sort({ updatedAt: -1 })
      .lean()
      .exec();
    return data;
  }
  public async findByRoleAndPagination({
    page,
    limit,
    filter,
  }: argsGetList): Promise<User[]> {
    return await UserModel.find({ roles: { $in: [`${filter}`] } })
      .populate('User')
      .skip(limit * (page - 1))
      .limit(limit)
      .sort({ updatedAt: -1 })
      .lean()
      .exec();
  }

  public async delete(id : Types.ObjectId) : Promise<void> {
    await UserModel.remove(id);
  }
}
