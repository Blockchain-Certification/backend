import { model, Schema, Types } from 'mongoose';

export const DOCUMENT_NAME = 'TypeDepartment';
export const COLLECTION_NAME = 'TYPE_DEPARTMENTS';

enum Type {
  DIPLOMA = 'DIPLOMA',
  CERTIFICATE = 'CERTIFICATE',
}

export default interface TypeDepartment {
  _id: Types.ObjectId;
  id?: string;
  name?: string;
  type?: Type;
  level?: string | undefined;
}

const schema = new Schema<TypeDepartment>(
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

export const TypeDepartmentModel = model<TypeDepartment>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
