import { model, Schema, Types } from 'mongoose';

export const DOCUMENT_NAME = 'GraduationCourse';
export const COLLECTION_NAME = 'GRADUATION_COURSES';

export default interface GraduationCourse {
  _id: Types.ObjectId;
  id?: string;
  name?: string;
  startDate?: Date;
  endDate?: Date;
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

schema.index({ idCourse: 1 }, { unique: true });

export const GraduationCourseModel = model<GraduationCourse>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
