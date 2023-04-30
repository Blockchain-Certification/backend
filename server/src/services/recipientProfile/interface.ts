import { FormOfTraining, Ranking } from "../../shared/database/model/DAC";
import { Types } from "mongoose";
export interface Pagination{
  page: number;
  limit: number;
}

<<<<<<< HEAD
export interface QueryParamaterGetListRecipientProfile extends Pagination{
=======
export interface PaginationGetList extends Pagination{
>>>>>>> 7b19cf4034d3a4cff2e1253a5deacbc951130f4f
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