import { model, Schema, Types } from 'mongoose';
import User from './User';
export const DOCUMENT_NAME = 'InfoUser';
export const COLLECTION_NAME = 'INFO_USERS';
const phoneRegExp = /^[0-9]{10}$/; // Example phone number regular expression, adjust to your needs

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  Other = 'OTHER',
}
export default interface InfoUser {
  _id?: Types.ObjectId;
  identity: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth?: Date | null;
  gender?: Gender;
  nation: string | null;
  idUser: Types.ObjectId;
  createdBy: Types.ObjectId | null;
}

const schema = new Schema<InfoUser>(
  {
    identity: { type: Schema.Types.String, required: true },
    idUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: Schema.Types.String, required: true },
    email: { type: Schema.Types.String, required: true },
    phone: {
      type: Schema.Types.String,
      required: true,
      validate: {
        validator: (v: string) => phoneRegExp.test(v),
        message: (props: any) => `${props.value} is not a valid phone number!`,
      },
    },
    address: { type: Schema.Types.String, required: true },
    dateOfBirth: { type: Schema.Types.Date, required: false },
    gender: {
      type: Schema.Types.String,
      required: true,
      enum: Object.values(Gender),
      default: Gender.FEMALE,
    },
    nation: { type: Schema.Types.String, required: false },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  { versionKey: false, timestamps: true },
);
schema.index({ idIdentity: 1, email: 1 }, { unique: true });

export const InfoUserModel = model<InfoUser>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
