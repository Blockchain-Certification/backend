import { DAC, DACModel } from '../model';
import { Types } from 'mongoose';
export class DACRepository {
  public async findByTypeCert(name: string): Promise<DAC | null> {
    return DACModel.findOne({ typeCertificate: name });
  }

  public async findByCourse(name: string): Promise<DAC | null> {
    return DACModel.findOne({ nameCourse: name });
  }

  public async findByIStudent(id: string): Promise<DAC | null> {
    return DACModel.findOne({ iSt: id });
  }

  public async findByIUni(id: string): Promise<DAC | null> {
    return DACModel.findOne({ iU: id });
  }
}
