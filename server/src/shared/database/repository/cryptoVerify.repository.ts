import {CryptoVerify, CryptoVerifyModel} from '../model';
 


export class CryptoVerifyRepository{
  public async create(cryptoVerify: CryptoVerify): Promise<CryptoVerify> {
    return await CryptoVerifyModel.create(cryptoVerify);
  }
}



export default CryptoVerifyRepository;

