import { GraduationYear, GraduationYearModel } from '../model';
import { Types } from 'mongoose';
export default class GraduationYearRepository {
  public async create(graduationYear: GraduationYear): Promise<GraduationYear> {
    return await GraduationYearModel.create(graduationYear);
  }

  public async findAll(): Promise<GraduationYear[]> {
    return GraduationYearModel.find();
  }

  public async find(page: number, limit: number): Promise<GraduationYear[]> {
    return GraduationYearModel.find()
      .skip(limit * (page - 1))
      .limit(limit)
      .sort({ updatedAt: -1 })
      .lean()
      .exec();
  }

  public async findById(id: Types.ObjectId): Promise<GraduationYear | null> {
    return await GraduationYearModel.findById(id);
  }

  public async update(id: Types.ObjectId, body: GraduationYear): Promise<void> {
    await GraduationYearModel.updateOne({ _id: id }, { $set: { ...body } });
  }

  public async delete(id: Types.ObjectId): Promise<void> {
    await GraduationYearModel.remove(id);
  }

  public async findByYear(year : string): Promise<GraduationYear | null>
  {
    return await GraduationYearModel.findOne({year});
  }
}
