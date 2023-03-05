import { DACRepository } from '../../../shared/database/repository';
import { Pagination } from '../manage/interface';
import { Types } from 'mongoose';
import { InfoUserRepository } from '../../../shared/database/repository/infoUser.repository';
import { BadRequestError } from '../../../shared/core/apiError';
import {
  getAllCertificateByStudent,
  queryCertificateSchema,
} from '../../../shared/fabric/callFuncChainCode/index';
import { mergeCertificateData } from '../utils';
import { InfoProof, Proof } from './interface';
import { generateDACProof } from '../../../shared/fabric';
export default class DACStudentService {
  private dacRepository: DACRepository;
  private infoUserRepository: InfoUserRepository;
  constructor(
    dacRepository: DACRepository,
    infoUserRepository: InfoUserRepository,
  ) {
    this.dacRepository = dacRepository;
    this.infoUserRepository = infoUserRepository;
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
    const mTreeProof = await generateDACProof(
      infoProofEncryption,
      identityStudent,
    );

    const disclosedData = await this.dacRepository.findByIdSelectField(
      idDAC,
      sharedFields,
    );

    return {
      proof: mTreeProof,
      disclosedData,
      dacID: dac._id,
    };
  }
}
