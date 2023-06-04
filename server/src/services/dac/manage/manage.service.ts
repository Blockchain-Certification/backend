import { DACRepository } from '../../../shared/database/repository';
import { CertificateType, DAC } from '../../../shared/database/model';
import { Types } from 'mongoose';
import { BadRequestError, InternalError } from '../../../shared/core/apiError';
import { CertificateTypeRepository } from '../../../shared/database/repository/certificateType.repository';
import { DTOIssue, Pagination } from './interface';
import { InfoUserRepository } from '../../../shared/database/repository/infoUser.repository';
import {
  generateMerkleRoot,
  createDigitalSignature,
} from '../../../shared/fabric';
import logger from '../../../shared/core/logger';
import { invokeChaincode } from '../../../shared/fabric';
import {
  queryUniversityProfileByName,
  getAllCertificateByUniversity,
} from '../../../shared/fabric/callFuncChainCode';
import { ArgsFunctionCallChainCode } from '../../../shared/fabric/chaincode';
import { mergeCertificateData } from '../utils';
import { dac } from '../..';
export default class ManageDACService {
  private dacRepository: DACRepository;
  private certRepository: CertificateTypeRepository;
  private infoUserRepository: InfoUserRepository;

  constructor(
    dacRepository: DACRepository,
    certRepository: CertificateTypeRepository,
    infoUserRepository: InfoUserRepository,
  ) {
    this.dacRepository = dacRepository;
    this.certRepository = certRepository;
    this.infoUserRepository = infoUserRepository;
  }

  public async issue(
    listIssue: DTOIssue,
    identityUniversity: string,
  ): Promise<DAC[]> {
    const { listDAC, idCertificate } = listIssue;

    const certificateTypes = await this.certRepository.findById(idCertificate);
    if (!certificateTypes) throw new BadRequestError('Certificate not exited');

    for (const dac of listDAC) {
      await this.validateDAC(dac._id, identityUniversity,certificateTypes.name);
    }

    const listDACIssue: DAC[] = [];
    for (const dac of listDAC) {
      const { _id } = dac;
      await this.updateStateDAC(_id, certificateTypes);

      await this.createDACBlockChain(_id);
      const DACIssue = await this.dacRepository.findById(_id);
      DACIssue && listDACIssue.push(DACIssue);
    }
    return listDACIssue;
  }

  public async getListDACOfUniversity(
    identityUniversity: string,
    pagination: Pagination,
  ): Promise<DAC[]> {
    const dacOfUniversity = await this.dacRepository.findByIUniAndPaginationOfDAC(
     pagination
    , identityUniversity
    );
    
    return dacOfUniversity;
  }

  public async detail(id: Types.ObjectId): Promise<DAC | null> {
    return await this.dacRepository.findById(id);
  }

  public async count(): Promise<number> {
    return this.dacRepository.count();
  }

  private async validateDAC(
    id: Types.ObjectId,
    identityUniversity: string,
    nameCertificate: string
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

    const listDAC : DAC[] = await this.dacRepository.findAllByIdentityUniversityAndIdentityStudent(identityUniversity,dac.iSt);
    if(listDAC.length > 0){
      const DACHaveCertificate = listDAC.filter((dac: DAC) =>{
        return dac.nameTypeCertificate === nameCertificate;
      })
      if(DACHaveCertificate.length > 0) throw new BadRequestError(`DAC have certificate at idDAC ${dac.id}}`);
    }

  }

  private async createDACBlockChain(id: Types.ObjectId): Promise<void> {
    try {
      const dacDBModel = await this.dacRepository.findById(id);

      const student =
        await this.infoUserRepository.findByIdentityAndAccountUserFromStudent(
          dacDBModel?.iSt || '',
        );
      if (!student) throw new BadRequestError('Identity Student not found');

      const university =
        await this.infoUserRepository.findByIdentityAndAccountUserFromUniversity(
          dacDBModel?.iU || '',
        );
      if (!university)
        throw new BadRequestError('Identity University not found');

      if (!dacDBModel?.iU || !dacDBModel?.iSt)
        throw new BadRequestError('Identity Student or University not found');

      const mTreeHash = await generateMerkleRoot(dacDBModel);

      const universitySignature = await createDigitalSignature(
        mTreeHash,
        dacDBModel?.iU,
      );
      const studentSignature = await createDigitalSignature(
        mTreeHash,
        dacDBModel?.iSt,
      );

      const properties = JSON.stringify(dacDBModel);

      const args: ArgsFunctionCallChainCode = {
        func: 'issueCertificate',
        args: [
          dacDBModel.year,
          dacDBModel.nameTypeCertificate,
          dacDBModel.nameCourse,
          properties,
          mTreeHash,
          universitySignature,
          studentSignature,
          new Date(),
          dacDBModel._id,
          university.idUser.publicKey,
          student.idUser.publicKey,
        ],
        isQuery: false,
        identity: dacDBModel.iU,
      };

      const chaincodeResult = await invokeChaincode(args);
      logger.debug(chaincodeResult);
    } catch (err) {
      throw new InternalError(err + '');
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
