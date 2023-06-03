import { Types } from 'mongoose';
import { DACGender, FormOfTraining } from '../../../shared/database/model/DAC';

export interface InfoProof{
  idDAC : Types.ObjectId;
  sharedFields : string[];
}

export interface Proof{ 
  proof : any,
  disclosedData : DisclosedData,
  dacID : Types.ObjectId
}

export interface DisclosedData {
  id: string;
  idNumber: string | null;
  registrationNum: string | null;
  iU: string;
  iSt: string;
  studentName?: string;
  universityName?: string;
  departmentName: string;
  dateOfBirth?: Date;
  year?: string;
  nameCourse?: string;
  major?: string;
  nameTypeCertificate?: string | null;
  typeCertificate?: string | null;
  levelCertificate?: number | null;
  placeOfBirth: string;
  nation: string;
  gender?: DACGender;
  ranking?: string | null; // Add ranking property with nullable string type
  formOfTraining?: FormOfTraining | null,
  CGPA?: string | null,
}

export interface ProofResponse {
  proof: any; // Replace 'any' with the actual type of mTreeProof
  disclosedData: any; // Replace 'any' with the actual type of disclosedData
  dacID: string; // Replace 'string' with the actual type of dac._id
  key: string;
}
