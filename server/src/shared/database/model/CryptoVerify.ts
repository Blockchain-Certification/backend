
import { Schema, model, Types } from 'mongoose';

export const DOCUMENT_NAME = 'CryptoVerify';
export const COLLECTION_NAME = 'CryptoVerifies';


export default interface CryptoVerify {
  _id?: Types.ObjectId;
  key: string;
  properties: string;
}

const schema = new Schema<CryptoVerify>(
  {
    key: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      maxlength: 1024,
      trim: true,
    },
    properties: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);


export const CryptoVerifyModel = model<CryptoVerify>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
