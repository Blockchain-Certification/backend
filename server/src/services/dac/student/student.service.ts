import { DACRepository } from '../../../shared/database/repository';
import { Pagination } from '../manage/interface';
import { Types } from 'mongoose';
import { InfoUserRepository } from '../../../shared/database/repository/infoUser.repository';
import { BadRequestError } from '../../../shared/core/apiError';
import { getAllCertificateByStudent } from '../../../shared/fabric/callFuncChainCode/index';
import { mergeCertificateData } from '../utils';

export default class DACStudentService{
  private dacRepository : DACRepository;
  private infoUserRepository : InfoUserRepository
  constructor(dacRepository:DACRepository,infoUserRepository:InfoUserRepository)
  {
    this.dacRepository = dacRepository;
    this.infoUserRepository = infoUserRepository;
  }
  
  public async getListDACOfStudent(identity : string,pagination : Pagination) : Promise<any[]>{
    const student = await this.infoUserRepository.findByIdentityAndAccountUserFromStudent(identity);
    if(!student) throw new BadRequestError('Student not exist');

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
}