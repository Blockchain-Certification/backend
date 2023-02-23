import { model, Schema, Types } from 'mongoose';

export const DOCUMENT_NAME = 'CertificateType';
export const COLLECTION_NAME = 'CERTIFICATE_TYPE';

enum Type {
  DIPLOMA = 'DIPLOMA',
  CERTIFICATE = 'CERTIFICATE',
}

export default interface CertificateType {
  _id: Types.ObjectId;
  id?: string;
  name?: string;
  type?: Type;
  level?: string | undefined;
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

export const CertificateTypeModel = model<CertificateType>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
