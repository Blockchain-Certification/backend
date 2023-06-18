import {
  DACRepository,
  CryptoVerifyRepository,
} from '../../../shared/database/repository';
import { BadRequestError, InternalError } from '../../../shared/core/apiError';
import { VerifyCrypto, VerifyProof } from './interface';
import { verifyCertificateProof } from '../../../shared/fabric';
import DACStudentService from '../student/student.service';
import { queryCertificateByUUID } from '../../../shared/fabric/callFuncChainCode';
import { ADMIN_ID } from '../../../common/constant';
import { DAC } from '../../../shared/database/model';

export default class DACGeneralService {
  private dacRepository: DACRepository;
  private cryptoVerifyRepository: CryptoVerifyRepository;

  constructor(
    dacRepository: DACRepository,
    cryptoVerifyRepository: CryptoVerifyRepository,
  ) {
    this.dacRepository = dacRepository;
    this.cryptoVerifyRepository = cryptoVerifyRepository;
  }

  public async verify(infoVerify: VerifyProof): Promise<any> {
    
    const dac = await this.dacRepository.findById(infoVerify.dacID);
    if (!dac) throw new BadRequestError('DAC not exist');
    
    const numberStatus = await verifyCertificateProof({ ...infoVerify, dac });
    await this.checkStatus(numberStatus, dac);

    return infoVerify.disclosedData;
  }

  public async verifyCrypto({
    key,
    identity,
    name,
    idDAC,
  }: VerifyCrypto): Promise<any> {
    const cryptoVerify = await this.cryptoVerifyRepository.findByKey(key);
    if (!cryptoVerify) throw new BadRequestError('Key is not valid');

    const proof: VerifyProof = JSON.parse(cryptoVerify.properties);

    const dac = await this.dacRepository.findById(proof.dacID);
    if (!dac) throw new BadRequestError(`dac not found ${proof.dacID}`);

    if (dac.id !== idDAC)
      throw new BadRequestError(`ID DAC is not valid ${idDAC}`);
    if (dac.iSt !== identity)
      throw new BadRequestError(`identity  is not valid ${identity}`);
    if (dac.studentName?.toLowerCase().trim() !== name.toLowerCase().trim())
      throw new BadRequestError(`student name is not valid ${name}`);

    const numberStatus = await verifyCertificateProof({ ...proof, dac });
    await this.checkStatus(numberStatus, dac);

    cryptoVerify._id &&
      (await this.cryptoVerifyRepository.remove(cryptoVerify?._id));

    return proof.disclosedData;
  }

  private async checkStatus(numberStatus: number, dac: DAC) {
    switch (numberStatus) {
      case 0:
        throw new BadRequestError('Proof is not correct');
      case 3:
        const idDACDB = dac._id.toString();
        const certBlockchain = await queryCertificateByUUID(idDACDB, ADMIN_ID);
        await this.backUpDatabase(certBlockchain, dac);
        throw new InternalError(
          'There was a data error. Please contact student create again certificate',
        );
    }
  }

  public async backUpDatabase(certBlockchain: any, dac : DAC){
    const dacBlockchain = JSON.parse(certBlockchain.properties);
    await this.dacRepository.update(dac._id, dacBlockchain);
  }

  
}
