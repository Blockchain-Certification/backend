import { DACRepository } from '../../shared/database/repository';
import { CertificateType } from '../../shared/database/model';
import { BadRequestError } from '../../shared/core/apiError';
import { Types } from 'mongoose';
import { isValidName } from './utils';
export default class CertificateTypeService {
  private repositoryMain: any;
  private dacRepository: DACRepository;
  constructor(repositoryMain: any, dacRepository: DACRepository) {
    this.repositoryMain = repositoryMain;
    this.dacRepository = dacRepository;
  }

  async getList(pageNumber: number, limit: number): Promise<CertificateType[]> {
    return this.repositoryMain.find(pageNumber, limit);
  }

  async create(newData: any): Promise<any> {
    const name = newData.name || newData.year;
    await this.isValidName(name);
    newData.id = ' ';
    return this.repositoryMain.create(newData);
  }

  public async edit(
    _id: Types.ObjectId,
    dataEdit: any,
  ): Promise<CertificateType | null> {
    await this.validId(_id, dataEdit.id);
    await this.checkUpBlockchain(_id);
    const name = dataEdit.name || dataEdit.year;
    await this.isValidName(name);
    await this.repositoryMain.update(_id, dataEdit);
    return await this.repositoryMain.findById(_id);
  }

  public async delete(id: Types.ObjectId): Promise<void> {
    await this.checkUpBlockchain(id);
    await this.repositoryMain.delete(id);
  }

  private async checkUpBlockchain(id: Types.ObjectId): Promise<void> {
    const cert = await this.repositoryMain.findById(id);
    if (!cert) throw new BadRequestError('Certificate type not exist');

    const existedDAC = await this.dacRepository.findByTypeCert(cert.name);
    if (existedDAC && existedDAC.length > 0)
      throw new BadRequestError(
        'Data that is on the DAC cannot be change',
      );
  }

  private async isValidName(name: string): Promise<void> {
    const list = await this.repositoryMain.findAll();
    if (await isValidName(name, list))
      throw new BadRequestError('Name is not valid');
  }

  private async validId(_id: Types.ObjectId, id: string): Promise<void> {
    const entity = await this.repositoryMain.findById(_id);
    if (entity.id !== id) throw new BadRequestError('id is not valid');
  }
}
