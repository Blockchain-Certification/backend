import { model, Schema, Types } from 'mongoose';

export const DOCUMENT_NAME = 'GraduationCourse';
export const COLLECTION_NAME = 'GRADUATION_COURSES';

export default interface GraduationCourse {
  _id: Types.ObjectId;
  id?: string;
  name: string;
  startDate: Date;
  endDate: Date;
}

const schema = new Schema<GraduationCourse>(
  {
    id: { type: Schema.Types.String, required: true },
    name: { type: Schema.Types.String, required: true },
    startDate: { type: Schema.Types.Date, required: true },
    endDate: { type: Schema.Types.Date, required: true },
  },
  { versionKey: false, timestamps: true },
);

schema.index({ id: 1 }, { unique: true });

schema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await GraduationCourseModel.countDocuments();
    const nextIdNumber = count + 1;
    const nextId = `KTN${nextIdNumber.toString().padStart(4, '0')}`;
    this.id = nextId;
  }
  return next();
});


export const GraduationCourseModel = model<GraduationCourse>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
