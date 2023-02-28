import { model, Schema, Types } from 'mongoose';
import { Gender } from './InfoUser';
export const DOCUMENT_NAME = 'DAC';
export const COLLECTION_NAME = 'DAC';

export enum Ranking {
  EXCELLENT = 'EXCELLENT',
  VERY_GOOD = 'VERY_GOOD',
  GOOD = 'GOOD',
  AVERAGE_GOOD = 'AVERAGE_GOOD',
  ORDINAL = 'ORDINAL',
}

export enum FormOfTraining {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  DISTANCE_LEARNING = 'DISTANCE_LEARNING',
  GUIDED_SELF_LEARNING = 'GUIDED_SELF_LEARNING',
}
export enum DACGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
export default interface DAC {
  _id: Types.ObjectId;
  id : string;
  idNumber: string | null; // IDENTIFICATION NUMBER
  registrationNum: string | null; // REGISTRATION NUMBER
  iU: string; //idIdentityUniversity
  iSt: string; //idIdentityStudent
  studentName?: string;
  universityName?: string;
  placeOfBirth: string;
  nation: string;
  dateOfBirth?: Date;
  year?: string;
  nameCourse?: string;
  major?: string;
  typeCertificate: string | null;
  ranking?: Ranking;
  dateOfIssuing: Date | null;
  formOfTraining?: FormOfTraining;
  CPGA?: string;
  gender?: DACGender;
  dispensingStatus: boolean;
}

const schema = new Schema<DAC>(
  {
    id : { type: Schema.Types.String, required: true },
    idNumber: { type: Schema.Types.String, required: false}, // so vao so
    registrationNum: {
      type: Schema.Types.String,
      required: false,
    }, // so hieu
    iU: { type: Schema.Types.String, required: true },
    iSt: { type: Schema.Types.String, required: true },
    studentName: { type: Schema.Types.String, required: true },
    universityName: { type: Schema.Types.String, required: true },
    dateOfBirth: { type: Schema.Types.Date, required: true },
    year: { type: Schema.Types.String, required: true },
    nameCourse: { type: Schema.Types.String, required: true },
    major: { type: Schema.Types.String, required: true },
    typeCertificate: { type: Schema.Types.String, required: false },
    placeOfBirth: { type: Schema.Types.String, required: true },
    nation: { type: Schema.Types.String, required: true },
    ranking: {
      type: Schema.Types.String,
      required: true,
      enum: Object.values(Ranking),
    },
    dateOfIssuing: { type: Schema.Types.Date, required: false },
    formOfTraining: {
      type: Schema.Types.String,
      required: true,
      enum: Object.values(FormOfTraining),
    },
    CPGA: { type: Schema.Types.String, required: true },
    gender: {
      type: Schema.Types.String,
      required: false,
      enum: Object.values(Gender),
      default: Gender.FEMALE,
    },
    dispensingStatus: {
      type: Schema.Types.Boolean,
      required: true,
      default: false,
    },
  },
  { versionKey: false, timestamps: true },
);

schema.index({
  idNumber: 1,
  registrationNum: 1,
  idSt: 1,
  idYear: 1,
  idCourse: 1,
  idDepartment: 1,
});

export const DACModel = model<DAC>(DOCUMENT_NAME, schema, COLLECTION_NAME);
