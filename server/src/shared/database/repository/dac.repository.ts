import { DAC, DACModel } from '../model';
import { Types } from 'mongoose';
import { QueryParamaterGetListRecipientProfile } from '../../../services/recipientProfile/interface';
import { Pagination } from '../../../services/dac/manage/interface';
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

  public async findByIdDAC(id: string): Promise<DAC[] | null> {
    return DACModel.find({ id: id });
  }
  
  public async findByIUniAndPagination(
    { page, limit, dispensingStatus,registrationNumber,idNumber }: QueryParamaterGetListRecipientProfile,
    id: string,
  ): Promise<DAC[] | null> {
    return DACModel.find({ iU: id, dispensingStatus,
      registrationNumber : { $exists: registrationNumber },
     idNumber :  { $exists: idNumber } })
                  .skip(limit * (page - 1))
                  .limit(limit)
                  .sort({ createdAt: -1 })
                  .lean()
                  .exec();
  }

  public async findByIdSelectField(
    id: Types.ObjectId,
    sharedFields: string[],
  ): Promise<DAC | null> {
    return DACModel.findById(id)
      .select(`${sharedFields.join(' ')} ` + ' -_id')
      .lean()
      .exec();
  }

  public async create(dac: DAC): Promise<DAC> {
    return DACModel.create(dac);
  }

  public async update(id: Types.ObjectId, body: any): Promise<void> {
    await DACModel.updateOne({ _id: id }, { $set: { ...body } });
  }

  public async deleteById(id: Types.ObjectId): Promise<void> {
    await DACModel.deleteOne({ _id: id });
  }

  public async isExisted(id: Types.ObjectId): Promise<boolean> {
    const regisNumber = await DACModel.findById({ _id: id });
    if (!regisNumber) return false;
    return true;
  }

  public async findByRegistrationNumber(
    registrationNum: string,
  ): Promise<DAC | null> {
    return await DACModel.findOne({ registrationNum });
  }

  public async findByListDACUUID(
    dacUUIDList: Types.ObjectId[],
    { page, limit }: Pagination,
  ): Promise<DAC[] | null> {
    return await DACModel.find()
      .where('_id')
      .in(dacUUIDList)
      .skip(limit * (page - 1))
      .limit(limit)
      .sort({ updatedAt: -1 })
      .lean()
      .exec();
  }

  public async isValidRegistrationNumber(
    regisNumber: string,
  ): Promise<boolean> {
    const isExisted = await this.findByRegistrationNumber(regisNumber);
    if (isExisted) return false;
    return true;
  }

  public async isValidRegisIdNumber(idNumber: string): Promise<boolean> {
    const isExisted = await this.findByRegistrationNumber(idNumber);
    if (isExisted) return false;
    return true;
  }

  public async countOfUniversity(idUniversity: string): Promise<number> {
    return await DACModel.find({
      iU: idUniversity,
    }).count();
  }

  public async count(): Promise<number> {
    return await DACModel.find({ dispensingStatus: true }).count();
  }
}
