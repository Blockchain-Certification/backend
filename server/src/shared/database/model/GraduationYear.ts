import { model, Schema, Types } from 'mongoose';

export const DOCUMENT_NAME = 'GraduationYear';
export const COLLECTION_NAME = 'GRADUATION_YEAR';

export default interface GraduationYear {
  _id: Types.ObjectId;
  id?: string;
  year: string;
}

const schema = new Schema<GraduationYear>(
  {
    id: { type: Schema.Types.String, required: true },
    year: { type: Schema.Types.String, required: true },
  },
  { versionKey: false, timestamps: true },
);

schema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await GraduationYearModel.countDocuments();
    const nextIdNumber = count + 1;
    const nextId = `N${nextIdNumber.toString().padStart(4, '0')}`;
    this.id = nextId;
  }
  return next();
});

export const GraduationYearModel = model<GraduationYear>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
