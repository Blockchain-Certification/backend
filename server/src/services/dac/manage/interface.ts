import { Types } from 'mongoose';

interface idDAC{
  _id : Types.ObjectId;
}

export interface DTOIssue { 
  listDAC : idDAC[],
  idCertificate : Types.ObjectId;
} 