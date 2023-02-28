import { DAC, DACModel } from '../model';
import { Types } from 'mongoose';
import { Pagination } from '../../../services/recipientProfile/recipientProfile.service';
import { dataDACUpdate } from '../../../services/recipientProfile/recipientProfile.service';
export class DACRepository {
  public async findById(id: Types.ObjectId): Promise<DAC | null> {
    return DACModel.findById(id);
  }
  public async findByTypeCert(name: string): Promise<DAC[] | null> {
    return DACModel.find({ typeCertificate: name });
  }

  public async findByCourse(name: string): Promise<DAC[] | null> {
    return DACModel.find({ nameCourse: `/^${name}$/` });
  }

  public async findByIStudent(id: string): Promise<DAC[] | null> {
    return DACModel.find({ iSt: id });
  }

  public async findByIUni(id: string): Promise<DAC[] | null> {
    return DACModel.find({ iU: id });
  }

  public async create(dac: DAC): Promise<DAC> {
    return DACModel.create(dac);
  }

  public async findByIUniAndPagination(
    { page, limit }: Pagination,
    id: string,
  ): Promise<DAC[] | null> {
    console.log(limit);
    return DACModel.find({ iU: id })
      .skip(limit * (page - 1))
      .limit(limit)
      .sort({ updatedAt: -1 })
      .lean()
      .exec();
  }

  public async update(id: Types.ObjectId, body: dataDACUpdate): Promise<void> {
    await DACModel.updateOne({ _id: id }, { $set: { ...body } });
  }
}
