import {
  DACRepository,
  InfoUserRepository,
} from '../../../shared/database/repository';
import { BadRequestError } from '../../../shared/core/apiError';
import { VerifyProof } from './interface';
import { verifyCertificateProof } from '../../../shared/fabric';

export default class DACGeneralService {
  private dacRepository: DACRepository;
  private infoUserRepository: InfoUserRepository;
  constructor(
    dacRepository: DACRepository,
    infoUserRepository: InfoUserRepository,
  ) {
    this.dacRepository = dacRepository;
    this.infoUserRepository = infoUserRepository;
  }

  public async verify(infoVerify: VerifyProof): Promise<void> {
    const dac = await this.dacRepository.findById(infoVerify.dacID);
    if (!dac) throw new BadRequestError('DAC not exist');
    const proofIsCorrect = await verifyCertificateProof({ ...infoVerify, dac });
    console.log(proofIsCorrect);
    if (!proofIsCorrect) throw new BadRequestError('Proof is not correct');
  }
}
