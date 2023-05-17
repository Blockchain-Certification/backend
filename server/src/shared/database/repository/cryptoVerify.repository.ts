import {CryptoVerify, CryptoVerifyModel} from '../model';
import { Types } from 'mongoose';
import { ObjectId } from 'mongodb';
 


export class CryptoVerifyRepository{
  public async create(cryptoVerify: CryptoVerify): Promise<CryptoVerify> {
    return  CryptoVerifyModel.create(cryptoVerify);
  }

  public async findByKey(key : string ) : Promise<CryptoVerify| null> {
    return CryptoVerifyModel.findOne({key});
  }

  public async remove( id :Types.ObjectId ){
    return CryptoVerifyModel.deleteOne({ _id: id });
  }
}



export default CryptoVerifyRepository;

