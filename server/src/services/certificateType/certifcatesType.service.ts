import {
  CertificateTypeRepository,
  DACRepository,
} from '../../shared/database/repository';
import { CertificateType } from '../../shared/database/model';
import { BadRequestError } from '../../shared/core/apiError';
import { Types } from 'mongoose';
export default class CertificateTypeService {
  private certificateTypeRepository: CertificateTypeRepository;
  private dacRepository: DACRepository;
  constructor(
    certificateTypeRepository: CertificateTypeRepository,
    dacRepository: DACRepository,
  ) {
    this.certificateTypeRepository = certificateTypeRepository;
    this.dacRepository = dacRepository;
  }

  async getList(pageNumber: number, limit: number): Promise<CertificateType[]> {
    return this.certificateTypeRepository.find(pageNumber, limit);
  }

  async create(certType: CertificateType): Promise<CertificateType | null> {
    const validName = await this.certificateTypeRepository.isValidName(
      certType.name,
    );
    if (validName) throw new BadRequestError('Name is existed');
    certType.id = ' ';
    return this.certificateTypeRepository.create(certType);
  }

  public async edit(
    id: Types.ObjectId,
    certType: CertificateType,
  ): Promise<CertificateType | null> {
    const cert = await this.certificateTypeRepository.findById(id);
    if (!cert) throw new BadRequestError('Certificate type not exist');

    const existedDAC = await this.dacRepository.findByTypeCert(cert.name);
    if (existedDAC && existedDAC.registrationNum !== undefined)
      throw new BadRequestError(
        'Data that is on the blockchain cannot be change',
      );

    const validName = await this.certificateTypeRepository.isValidName(
      certType.name,
    );
    if (validName) throw new BadRequestError('Name is existed');

    return await this.certificateTypeRepository.findIdAndUpdate(id, certType);
  }

  public async delete (id : Types.ObjectId) : Promise<void> {
    await this.certificateTypeRepository.delete(id)
  }
}
