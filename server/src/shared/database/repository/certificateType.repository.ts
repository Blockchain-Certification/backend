import { Types } from 'mongoose';
import { CertificateType, CertificateTypeModel } from '../model';
export class CertificateTypeRepository {
  public async find(
    pageNumber: number,
    limit: number,
  ): Promise<CertificateType[]> {
    return CertificateTypeModel.find()
      .skip(limit * (pageNumber - 1))
      .limit(limit)
      .sort({ updatedAt: -1 })
      .lean()
      .exec();
  }

  public async create(certType: CertificateType): Promise<CertificateType> {
    return CertificateTypeModel.create(certType);
  }
  public async findAll(): Promise<CertificateType[]> {
    return CertificateTypeModel.find();
  }
  public async isValidName(name: string): Promise<boolean> {
    name = clearCharacter(name);
    const list = await this.findAll();
    
    const check = await list.filter((cert) => {
      const nameCert = clearCharacter(cert.name);
      return nameCert === name;
    });
    if (check.length > 0 ) return true;
    
    return false;
    
    function clearCharacter(name: string) {
      return name.toLowerCase().replace(/\s+/g, '');
    }
  }

  public async findByName(name: string): Promise<CertificateType | null> {
    return CertificateTypeModel.findOne({ name });
  }

  public async findById(id: Types.ObjectId): Promise<CertificateType | null> {
    return CertificateTypeModel.findById(id);
  }

  public async findIdAndUpdate(id: Types.ObjectId,body : CertificateType): Promise<CertificateType | null>{
    return CertificateTypeModel.findByIdAndUpdate(id,body);
  }

  public async delete(id: Types.ObjectId): Promise<void> {
    return CertificateTypeModel.remove(id);
  }
}
