import { DACRepository } from '../../../shared/database/repository';
import { CertificateType, DAC } from '../../../shared/database/model';
import { Types } from 'mongoose';
import { BadRequestError } from '../../../shared/core/apiError';
import { CertificateTypeRepository } from '../../../shared/database/repository/certificateType.repository';
import { DTOIssue } from './interface';
import { InfoUserRepository } from '../../../shared/database/repository/infoUser.repository';
import {generateMerkleRoot} from '../../../shared/helpers/encryption';
export default class ManageDACService {
  private dacRepository: DACRepository;
  private certRepository: CertificateTypeRepository;
  private infoUserRepository : InfoUserRepository;
  
  constructor(
    dacRepository: DACRepository,
    certRepository: CertificateTypeRepository,
    infoUserRepository : InfoUserRepository
  ) {
    this.dacRepository = dacRepository;
    this.certRepository = certRepository;
    this.infoUserRepository = infoUserRepository;
  }

  public async issue(
    listIssue: DTOIssue,
    identityUniversity: string,
  ): Promise<void> {
    const { listDAC, idCertificate } = listIssue;
    for (let i = 0; i < listDAC.length; i++) {
      await this.validateDAC(listDAC[i]._id, identityUniversity);
    }

    const certificateTypes = await this.certRepository.findById(idCertificate);
    if (!certificateTypes) throw new BadRequestError('Certificate not exited');

    for (const dac of listDAC) {
      const { _id } = dac;
      await this.createDACBlockChainAndUpdateStateDAC(_id);
    }
  }

  public async detail(id: Types.ObjectId): Promise<DAC | null> {
    return await this.dacRepository.findById(id);
  }

  private async validateDAC(
    id: Types.ObjectId,
    identityUniversity: string,
  ): Promise<void> {
    const dac = await this.detail(id);

    if (!dac) throw new BadRequestError(`DAC not existed `);

    const {
      idNumber,
      registrationNum,
      iU,
      typeCertificate,
      dateOfIssuing,
      dispensingStatus,
      nameTypeCertificate,
      levelCertificate,
    } = dac;

    switch (true) {
      case !idNumber:
        throw new BadRequestError(`idNumber not existed at idDAC ${id}`);
      case !registrationNum:
        throw new BadRequestError(`RegistrationNum not existed at idDAC ${id}`);
      case iU !== identityUniversity:
        throw new BadRequestError(
          `Account use request not match with DAC at idDAC ${id}. Must identity of user login match with iU`,
        );
      case Boolean(typeCertificate) ||
        Boolean(nameTypeCertificate) ||
        Boolean(levelCertificate):
        throw new BadRequestError(
          `Certificate is existed. Please consider typeCertificate, nameCertificate, levelCertificate at ${id}`,
        );
      case Boolean(dateOfIssuing):
        throw new BadRequestError(`Date Of Issuing  is existed at id ${id}`);
      case Boolean(dispensingStatus):
        throw new BadRequestError(`Dispensing Status is updated at id ${id}`);
    }
  }

  private async createDACBlockChainAndUpdateStateDAC(id : Types.ObjectId) : Promise<void> {
    try{
      const dacDBModel = await this.dacRepository.findById(id);
      
      const student = await this.infoUserRepository.findByIdentityAndAccountUserFromStudent(dacDBModel?.iSt || '');
      if(!student) throw new BadRequestError('Identity Student not found');
      
      const university = await this.infoUserRepository.findByIdentityAndAccountUserFromUniversity(dacDBModel?.iU || '');
      if(!university) throw new BadRequestError('Identity University not found');
      
      const mTreeHash =  await generateMerkleRoot(dacDBModel);
      console.log(mTreeHash);
      
    }
    catch(err)
    {
      console.log(err);
    }
  }
  private async updateStateDAC(
    _id: Types.ObjectId,
    { name, type, level }: CertificateType,
  ): Promise<void> {
    const body = {
      dateOfIssuing: new Date(),
      typeCertificate: type,
      nameTypeCertificate: name,
      levelCertificate: level,
      dispensingStatus: true,
    };
    await this.dacRepository.update(_id, body);
  }

}
