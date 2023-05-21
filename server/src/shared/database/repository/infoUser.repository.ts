import { InfoUser, InfoUserModel, Role } from '../model';
import { filterNonNullWithPagination } from '../../helpers/utils';
import { Types } from 'mongoose';
import { Pagination } from '../../../services/recipientProfile/interface';
import { PaginationSearch} from '../../../services/user/student/interface';
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

  public async findByIdUser(idUser: Types.ObjectId): Promise<InfoUser | null> {
    return InfoUserModel.findOne({ idUser });
  }
  public async findByIdAndAccountUser(id: Types.ObjectId): Promise<any> {
    return await InfoUserModel.findById(id).populate({
      path: 'idUser',
      select: '-password',
    });
  }

  public async findByIdAndAccountUserFromStudent(
    id: Types.ObjectId,
  ): Promise<any> {
    const data = await InfoUserModel.findById(id).populate({
      path: 'idUser',
      match: { roles: { $in: [Role.STUDENT] } },
      select: '-password',
    });
    if (!data?.idUser) return {};
    return data;
  }

  public async findByIdentityAndAccountUserFromStudent(
    identity: string,
  ): Promise<any> {
    const data = await InfoUserModel.findOne({ identity }).populate({
      path: 'idUser',
      match: { roles: { $in: [Role.STUDENT] } },
      select: '-password',
    });
    if (!data?.idUser) return {};
    return data;
  }

  public async findByIdentityAndAccountUserFromUniversity(
    identity: string,
  ): Promise<any> {
    const data = await InfoUserModel.findOne({ identity }).populate({
      path: 'idUser',
      match: { roles: { $in: [Role.UNIVERSITY] } },
      select: '-password',
    });
    if (!data?.idUser) return {};
    return data;
  }

  public async findInfoAndAccountFromStudent(
    pagination: Pagination,
  ): Promise<any[]> {
    const data = await InfoUserModel.find()
      .populate({
        path: 'idUser',
        match: { roles: { $in: [Role.STUDENT] } },
        select: '-password',
      })
      .populate({
        path: 'createdBy',
        select: '-password',
      })
      .sort({ updatedAt: -1 })
      .lean()
      .exec();
    return await filterNonNullWithPagination(data, pagination);
  }

  public async findByIdAndAccountUserFromUniversity(
    id: Types.ObjectId,
  ): Promise<any> {
    const data = await InfoUserModel.findById(id).populate({
      path: 'idUser',
      match: { roles: { $in: [Role.UNIVERSITY] } },
      select: '-password',
    });
    if (!data?.idUser) return {};
    return data;
  }

  public async findInfoAndAccountFromUniversity(
    pagination: Pagination,
  ): Promise<any[]> {
    const data = await InfoUserModel.find()
      .sort({ updatedAt: -1 })
      .populate({
        path: 'idUser',
        match: { roles: { $in: [Role.UNIVERSITY] } },
        select: '-password',
      })
      .lean()
      .exec();
    return await filterNonNullWithPagination(data, pagination);
  }

  public async findInfoAndAccountFromStudentOfUniversity(
    pagination: Pagination,
    idUni: Types.ObjectId,
  ): Promise<any[]> {
    const data = await InfoUserModel.find({ createdBy: idUni })
      .populate({
        path: 'idUser',
        match: { roles: { $in: [Role.STUDENT] } },
        select: '-password',
      })
      .populate({
        path: 'createdBy',
        select: '-password',
      })
      .sort({ updatedAt: -1 })
      .lean()
      .exec();
    return await filterNonNullWithPagination(data, pagination);
  }

  public async findInfoAndAccountFromKeyWordOfRoleStudent({
    page,
    limit,
    keyword,
  }: PaginationSearch): Promise<any> {
    const data = await InfoUserModel.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { identity: { $regex: keyword, $options: 'i' } },
      ],
    })
      .populate({
        path: 'idUser',
        match: { roles: { $in: [Role.STUDENT] } },
        select: '-password',
      })

      .sort({ updatedAt: -1 })
      .lean()
      .exec();
    const pagination:  Pagination = {
      page,
      limit,
    }
    return await filterNonNullWithPagination(data, pagination);
  }

  public async findInfoAndAccountFromKeyWordOfRoleUniversity({
    page,
    limit,
    keyword,
  }: PaginationSearch): Promise<any> {
    const data = await InfoUserModel.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { identity: { $regex: keyword, $options: 'i' } },
      ],
    })
      .populate({
        path: 'idUser',
        match: { roles: { $in: [Role.UNIVERSITY] } },
        select: '-password',
      })
      .skip(limit * (page - 1))
      .limit(limit)
      .sort({ updatedAt: -1 })
      .lean()
      .exec();
      const pagination:  Pagination = {
        page,
        limit,
      }
    return await filterNonNullWithPagination(data,pagination);
  }

  public async edit(id: Types.ObjectId, data: any): Promise<void> {
    await InfoUserModel.updateOne({ _id: id }, { $set: { ...data } });
  }

  public async delete(id: Types.ObjectId): Promise<void> {
    await InfoUserModel.deleteOne({ _id: id });
  }

  public async count(): Promise<number> {
    return InfoUserModel.count();
  }
}
