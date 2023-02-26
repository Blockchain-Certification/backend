import { GraduationCourseModel, GraduationCourse } from './../model';
import { Types } from 'mongoose';
export default class GraduationCourseRepository {
  public async create(
    graduationCourse: GraduationCourse,
  ): Promise<GraduationCourse> {
    return await GraduationCourseModel.create(graduationCourse);
  }

  public async findAll(): Promise<GraduationCourse[]> {
    return GraduationCourseModel.find();
  }

  public async find(page: number, limit: number): Promise<GraduationCourse[]> {
    return GraduationCourseModel.find()
      .skip(limit * (page - 1))
      .limit(limit)
      .sort({ updatedAt: -1 })
      .lean()
      .exec();
  }

  public async findById(id: Types.ObjectId): Promise<GraduationCourse | null> {
    return await GraduationCourseModel.findById(id);
  }

  public async update(
    id: Types.ObjectId,
    body: GraduationCourse,
  ): Promise<void> {
    await GraduationCourseModel.updateOne({ _id: id }, { $set: { ...body } });
  }


  public async delete(id: Types.ObjectId): Promise<void> {
    await GraduationCourseModel.remove(id);
  }
}
