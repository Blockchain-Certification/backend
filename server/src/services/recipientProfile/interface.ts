import { FormOfTraining, Ranking } from "../../shared/database/model/DAC";
import { Types } from "mongoose";
export interface Pagination{
  page: number;
  limit: number;
}

export interface QueryParamaterGetListRecipientProfile extends Pagination{
  registrationNumber: boolean,
  idNumber: boolean,
  dispensingStatus: boolean;
}

export interface DataDACUpdate {
  year: string;
  nameCourse: string;
  major: string;
  ranking: Ranking;
  formOfTraining: FormOfTraining;
  CGPA: string;
}

export interface DTORegistrationNumber{
  _id : Types.ObjectId;
  registrationNumber : string;
}

export interface DTORegistrationIdNumber{
  _id : Types.ObjectId;
  idNumber : string;
}

export interface FlagFilter{
  registrationNumber:  boolean,
  idNumber: boolean
}