import { model, Schema, Types } from 'mongoose';

export const DOCUMENT_NAME = 'CertificateType';
export const COLLECTION_NAME = 'CERTIFICATE_TYPE';

export enum Type {
  DIPLOMA = 'DIPLOMA',
  CERTIFICATE = 'CERTIFICATE',
}

export default interface CertificateType {
  _id: Types.ObjectId;
  id?: string;
  name: string;
  type: Type;
  level: number | null;
}

const schema = new Schema<CertificateType>(
  {
    id: { type: Schema.Types.String, required: true },
    name: { type: Schema.Types.String, required: true },
    type: {
      type: Schema.Types.String,
      required: true,
      enum: Object.values(Type),
      default: Type.DIPLOMA,
    },
    level: { type: Schema.Types.Number },
  },
  { versionKey: false, timestamps: true },
);

schema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await CertificateTypeModel.countDocuments();
    const nextIdNumber = count + 1;
    const nextId = `LCC${nextIdNumber.toString().padStart(4, '0')}`;
    this.id = nextId;
  }
  return next();
});

export const CertificateTypeModel = model<CertificateType>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
