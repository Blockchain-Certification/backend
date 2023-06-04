import {
  CryptoVerifyRepository,
  DACRepository,
} from '../../../shared/database/repository';
import { Pagination } from '../manage/interface';
import { InfoUserRepository } from '../../../shared/database/repository/infoUser.repository';
import { BadRequestError, InternalError } from '../../../shared/core/apiError';
import { getAllCertificateByStudent } from '../../../shared/fabric/callFuncChainCode/index';
import { mergeCertificateData } from '../utils';
import { InfoProof, Proof } from './interfaces';
import { generateDACProof, validateRoot } from '../../../shared/fabric';
import { Types } from 'mongoose';
import { CryptoVerify, DAC } from '../../../shared/database/model';
import { formatSchemaDisclosedData, randomKey } from './utils';

export default class DACStudentService {
  private dacRepository: DACRepository;
  private infoUserRepository: InfoUserRepository;
  private cryptoVerifyRepository: CryptoVerifyRepository;
  constructor(
    dacRepository: DACRepository,
    infoUserRepository: InfoUserRepository,
    cryptoVerifyRepository: CryptoVerifyRepository,
  ) {
    this.dacRepository = dacRepository;
    this.infoUserRepository = infoUserRepository;
    this.cryptoVerifyRepository = cryptoVerifyRepository;
  }

  public async getListDACOfStudent(
    identity: string,
    pagination: Pagination,
  ): Promise<any[]> {
    const student =
      await this.infoUserRepository.findByIdentityAndAccountUserFromStudent(
        identity,
      );
    if (!student) throw new BadRequestError('Student not exist');

    const dacLedgerDataList = await getAllCertificateByStudent(
      student.idUser.publicKey,
      student.identity,
    );

    const dacUUIDList = await dacLedgerDataList.map((el: any) => {
      return el.certUUID;
    });

    const dacDBRecords = await this.dacRepository.findByListDACUUID(
      dacUUIDList,
      pagination,
    );
    if (!dacDBRecords) return [];
    return await mergeCertificateData(dacDBRecords, dacLedgerDataList);
  }

  public async generateProof(
    { sharedFields, idDAC }: InfoProof,
    identityStudent: string,
  ): Promise<Proof> {
    const dac = await this.dacRepository.findById(idDAC);

    if (!dac) throw new BadRequestError('DAC not existed');
    if (dac.iSt !== identityStudent)
      throw new BadRequestError('User not authorized of DAC ' + dac.id);
    
      const infoProofEncryption = {
      sharedFields,
      idDAC,
      dac,
    };

    const certBlockchainPayload = await validateRoot(dac);
    
    if(!certBlockchainPayload.isValid){
        await this.backUpDatabase(certBlockchainPayload.certBlockchain, dac);
        throw new InternalError('There was a data error. Please try again');

    }

    const mTreeProof = await generateDACProof(
      infoProofEncryption,
      identityStudent,
    );

    const disclosedData : DAC | null= await this.dacRepository.findByIdSelectField(
      idDAC,
      sharedFields,
    );
    if(!disclosedData) throw new BadRequestError(`DAC is not found ${idDAC}`);

    const key = await randomKey();
    const proofResponse = {
      proof: mTreeProof,
      disclosedData: formatSchemaDisclosedData(disclosedData),
      dacID: dac._id,
      identityStudent: dac.iSt,
      mTreeRootBlockchain: certBlockchainPayload.certBlockchain.certHash,
      key,
    };
    const modelCryptoVerify: CryptoVerify = {
      key,
      properties: JSON.stringify(proofResponse),
    };
    await this.cryptoVerifyRepository.create(modelCryptoVerify);

    return proofResponse;
  }

  public async count(): Promise<number> {
    return this.dacRepository.count();
  }

  public async detail(id: Types.ObjectId): Promise<DAC | null> {
    return await this.dacRepository.findById(id);
  }

  public async backUpDatabase(certBlockchain: any, dac : DAC){
    const dacBlockchain = JSON.parse(certBlockchain.properties);
    await this.dacRepository.update(dac._id, dacBlockchain);
  }
}
