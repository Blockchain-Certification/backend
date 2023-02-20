import { model, Schema, Types } from 'mongoose';

export const DOCUMENT_NAME = 'GraduationYear';
export const COLLECTION_NAME = 'GRADUATION_YEAR';

export default interface GraduationYear {
  _id: Types.ObjectId;
  id: string;
  year : Date;
}

const schema = new Schema<GraduationYear>(
  {
    id: { type: Schema.Types.String, required: true },
    year: { type: Schema.Types.Date, required: true },
  },
  { versionKey: false, timestamps: true },
);


export const GraduationYearModel = model<GraduationYear>(
    DOCUMENT_NAME,
    schema,
    COLLECTION_NAME
  );