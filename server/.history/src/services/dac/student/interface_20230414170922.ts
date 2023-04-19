import { Types } from 'mongoose';

export interface InfoProof{
  idDAC : Types.ObjectId;
  sharedFields : string[];
}

export interface Proof{ 
  proof : Buffer[],
  disclosedData : any,
  dacID : Types.ObjectId
}