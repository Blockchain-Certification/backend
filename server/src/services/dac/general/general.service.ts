import {
  DACRepository,
  InfoUserRepository,
  CryptoVerifyRepository
} from '../../../shared/database/repository';
import { BadRequestError } from '../../../shared/core/apiError';
import { Proof, VerifyCrypto, VerifyProof } from './interface';
import { verifyCertificateProof } from '../../../shared/fabric';
import { Types } from 'mongoose';

export default class DACGeneralService {
  private dacRepository: DACRepository;
  private infoUserRepository: InfoUserRepository;
  private cryptoVerifyRepository: CryptoVerifyRepository; 
  constructor(
    dacRepository: DACRepository,
    infoUserRepository: InfoUserRepository,
    cryptoVerifyRepository: CryptoVerifyRepository
  ) {
    this.dacRepository = dacRepository;
    this.infoUserRepository = infoUserRepository;
    this.cryptoVerifyRepository = cryptoVerifyRepository;
  }

  public async verify(infoVerify: VerifyProof): Promise<any> {
    
    const dac = await this.dacRepository.findById(infoVerify.dacID);
    if (!dac) throw new BadRequestError('DAC not exist');

    const proofIsCorrect = await verifyCertificateProof({ ...infoVerify, dac });
    if (!proofIsCorrect) throw new BadRequestError('Proof is not correct');
    return infoVerify.disclosedData;
  }

  public async verifyCrypto({key, identity, name} : VerifyCrypto): Promise<any> {
    const cryptoVerify = await this.cryptoVerifyRepository.findByKey(key);
    if(!cryptoVerify) throw new BadRequestError('Key is not valid');
    
    const proof : Proof = JSON.parse(cryptoVerify.properties);
    
    const dac = await this.dacRepository.findById(proof.dacID); 
    if(!dac) throw new BadRequestError(`dac not found ${proof.dacID}`);
    
    if(dac.iSt !==  identity) throw new BadRequestError(`identity  is not valid ${identity}`);
    if(dac.studentName?.toLowerCase().trim() !== name.toLowerCase().trim())
      throw new BadRequestError(`student name is not valid ${name}`);
   
    const proofIsCorrect = await verifyCertificateProof({ ...proof, dac });
    if (!proofIsCorrect) throw new BadRequestError('Proof is not correct');
  
    cryptoVerify._id && await this.cryptoVerifyRepository.remove(cryptoVerify?._id);
    return proof;
  }
}
