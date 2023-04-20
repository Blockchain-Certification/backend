import { DACRepository } from '../../../shared/database/repository';
import { Pagination } from '../manage/interface';
import { InfoUserRepository } from '../../../shared/database/repository/infoUser.repository';
import { BadRequestError } from '../../../shared/core/apiError';
import {
  getAllCertificateByStudent,
} from '../../../shared/fabric/callFuncChainCode/index';
import { mergeCertificateData } from '../utils';
import { InfoProof, Proof } from './interface';
import { generateDACProof } from '../../../shared/fabric';
const mongoose = require('mongoose');

const certificateDBData ={
  _id:  new mongoose.Types.ObjectId('643e3c3a2ff2b2918773a484'),
  id: 'MAHOSO123',
  idNumber: '123123',
  registrationNum: '123123123123',
  iU: '111033111201',
  iSt: '101231110312',
  studentName: 'Long Tran gww',
  universityName: 'Pham NGoc Phu',
  departmentName: 'CNTT',
  dateOfBirth: '2016-01-01T00:00:00.000Z',
  year: '2023',
  nameCourse: 'Khóa học 2233',
  major: 'CNTT',
  nameTypeCertificate: 'hehe',
  typeCertificate: 'DIPLOMA',
  levelCertificate: null,
  placeOfBirth: 'TPHCM',
  nation: 'Kinh',
  ranking: 'VERY_GOOD',
  dateOfIssuing: '2023-04-18T06:45:38.063Z',
  formOfTraining: 'FULL_TIME',
  CGPA: '7.8',
  gender: 'FEMALE',
  dispensingStatus: true,
  createdAt: '2023-04-18T06:44:10.444Z',
  updatedAt: '2023-04-18T06:45:38.064Z'
};
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

  public async count(): Promise<number> {
    return this.dacRepository.count();
  }
}
