import { Types } from 'mongoose';

export interface InfoProof{
  idDAC : Types.ObjectId;
  sharedFields : string[];
}

export interface Proof{ 
  proof : any,
  disclosedData : any,
  dacID : Types.ObjectId,
  key ?: string
}
export interface ProofData {
  type: string;
  data: number[];
}
export interface VerifyProof{
  proof : any,
  disclosedData : any,
  dacID : Types.ObjectId
}

export interface VerifyCrypto{
  key : string,
  name : string,
  identity : string,
  idDAC: string
}