import { model, Schema, Types } from 'mongoose';
export const DOCUMENT_NAME = 'DAC';
export const COLLECTION_NAME = 'DAC';

enum Ranking {
  EXCELLENT = 'EXCELLENT',
  VERY_GOOD = 'VERY_GOOD',
  GOOD = 'GOOD',
  AVERAGE_GOOD = 'AVERAGE_GOOD',
  ORDINAL = 'ORDINAL',
}

enum FormOfTraining {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  DISTANCE_LEARNING = 'DISTANCE_LEARNING',
  GUIDED_SELF_LEARNING = 'GUIDED_SELF_LEARNING',
}
enum DACGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
export default interface DAC {
  _id: Types.ObjectId;
  idNumber: string; // IDENTIFICATION NUMBER
  registrationNum: string; // REGISTRATION NUMBER
  iU?: string; //idIdentityUniversity
  iSt?: string; //idIdentityStudent
  studentName?: string;
  universityName?: string;
  dateOfBirth?: Date;
  year?: Date;
  nameCourse?: string;
  major?: string;
  typeCertificate?: string;
  ranking?: Ranking;
  dateOfIssuing?: Date;
  formOfTraining?: FormOfTraining;
  CPGA?: string;
  gender?:DACGender;
}

const schema = new Schema<DAC>(
  {
    idNumber: { type: Schema.Types.String, required: true },
    registrationNum: { type: Schema.Types.String, required: true },
    iU: { type: Schema.Types.ObjectId, required: true },
    iSt: { type: Schema.Types.ObjectId, required: true },
    studentName: { type: Schema.Types.String, required: true },
    universityName: { type: Schema.Types.String, required: true },
    dateOfBirth: { type: Schema.Types.Date, required: true },
    year: { type: Schema.Types.Date, required: true },
    nameCourse: { type: Schema.Types.String, required: true },
    major: { type: Schema.Types.String, required: true },
    typeCertificate: { type: Schema.Types.String, required: true },
    ranking: {
      type: Schema.Types.String,
      required: true,
      enum: Object.values(Ranking),
    },
    dateOfIssuing: { type: Schema.Types.Date, required: true },
    formOfTraining: {
      type: Schema.Types.String,
      required: true,
      enum: Object.values(FormOfTraining),
    },
    CPGA: { type: Schema.Types.String, required: true },
    gender : { type: Schema.Types.String, required: true}
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
