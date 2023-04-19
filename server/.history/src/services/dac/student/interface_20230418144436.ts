import { Types } from 'mongoose';

export interface InfoProof{
  idDAC : Types.ObjectId;
  sharedFields : string[];
}

export interface Proof{ 
  proof : any,
  disclosedData : any,
  dacID : Types.ObjectId
}