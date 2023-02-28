import { InfoUser, InfoUserModel, Role } from '../model';
import { argsGetList } from '../../../services/user/user.service';
import { filterNull } from '../../helpers/utils';
import { Types } from 'mongoose';
export class InfoUserRepository {
  public async create(user: InfoUser): Promise<InfoUser> {
    return InfoUserModel.create(user);
  }

  public async findByIdentity(identity: string): Promise<InfoUser | null> {
    return await InfoUserModel.findOne({ identity });
  }
  public async findByEmail(email: string): Promise<string | undefined> {
    const user = await InfoUserModel.findOne({ email });
    return user?.email;
  }
  public async findByPhone(phone: string): Promise<string | undefined> {
    const user = await InfoUserModel.findOne({ phone });
    return user?.phone;
  }

  public async findById(id: Types.ObjectId): Promise<InfoUser | null> {
    return InfoUserModel.findById(id);
  }

  public async findByIdAndAccountUser(id: Types.ObjectId): Promise<any> {
    return await InfoUserModel.findOne({ id }).populate({
      path: 'idUser',
      select: '-password',
    });
  }

  public async findInfoAndAccount(page: number, limit: number): Promise<any[]> {
    return await InfoUserModel.find({})
      .populate({
        path: 'idUser',
        match: { roles: { $in: [Role.STUDENT, Role.UNIVERSITY] } },
        select: '-password',
      })
      .skip(limit * (page - 1))
      .limit(limit)
      .sort({ updatedAt: -1 })
      .lean()
      .exec();
  }

  public async findByRole({
    page,
    limit,
    filter,
  }: argsGetList): Promise<any[]> {
    const data = await InfoUserModel.find()
      .populate({
        path: 'idUser',
        match: { roles: { $in: [`${filter}`] } },
        select: '-password',
      })
      .skip(limit * (page - 1))
      .limit(limit)
      .sort({ updatedAt: -1 })
      .lean()
      .exec();
    return filterNull(data);
  }

  public async edit(id: Types.ObjectId, data: any): Promise<void> {
    await InfoUserModel.updateOne({ _id: id }, { $set: { ...data } });
  }

  public async delete(id: Types.ObjectId): Promise<void> {
    await InfoUserModel.deleteOne({ _id: id });
  }
}
