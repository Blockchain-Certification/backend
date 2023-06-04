import { Types } from "mongoose";

import { CheckUpBlockchain } from "../checkUpBlockchain";
import { CertificateTypeRepository } from "../../../../shared/database/repository";
import { BadRequestError } from "../../../../shared/core/apiError";
import { getAllCertificatesByNameCertificate } from "../../../../shared/fabric/callFuncChainCode";
import { CertificateType } from "../../../../shared/database/model";

export class CheckCert implements CheckUpBlockchain{
  
  private certRepository = new CertificateTypeRepository();
  
  async check(id: Types.ObjectId, identity : string) {
      const cert: CertificateType | null = await this.certRepository.findById(id);
      if(!cert) throw new BadRequestError(`Cert not found`);
      const listDAC = await getAllCertificatesByNameCertificate(cert.name, identity);
      if(listDAC.length > 0) throw new BadRequestError(`Cert have up to blockchain`);
  }
}