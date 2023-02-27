import { model, Schema, Types } from 'mongoose';
import User from './User';
export const DOCUMENT_NAME = 'InfoUser';
export const COLLECTION_NAME = 'INFO_USERS';
const phoneRegExp = /^[0-9]{10}$/; // Example phone number regular expression, adjust to your needs

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  Other = 'null',
}
export default interface InfoUser {
  _id?: Types.ObjectId;
  identity: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
  dateOfBirth?: Date;
  gender?: Gender;
  nation?: string;
  idUser: Types.ObjectId;
}

const schema = new Schema<InfoUser>(
  {
    identity: { type: Schema.Types.String, required: true },
    idUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: Schema.Types.String, required: true },
    email: { type: Schema.Types.String, required: true },
    phone: {
      type: Schema.Types.String,
      required: false,
      default: null,
    },
    address: { type: Schema.Types.String, required: false, default: null },
    dateOfBirth: { type: Schema.Types.Date, required: false, default: null },
    gender: {
      type: Schema.Types.String,
      required: false,
      default: Gender.Other,
      enum: Object.values(Gender),
    },
    nation: { type: Schema.Types.String, required: false, default: null },
  },
  { versionKey: false, timestamps: true },
);
schema.index({ idIdentity: 1, email: 1 }, { unique: true });

export const InfoUserModel = model<InfoUser>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
