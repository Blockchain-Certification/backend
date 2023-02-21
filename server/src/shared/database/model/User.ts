import { model, Schema, Types } from 'mongoose';

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'USERS';

export enum Role {
  DOET = ' DOET', //Department of Education and Training (DOET).
  STUDENT = 'STUDENT',
  UNIVERSITY = 'UNIVERSITY',
}

export default interface User {
  _id: Types.ObjectId;
  userName: string;
  password: string;
  roles: Role[];
  publicKey?: string;
}

const schema = new Schema<User>(
  {
    userName: {
      type: Schema.Types.String,
      unique: true,
      trim: true,
      required: true,
    },
    password: { type: Schema.Types.String, required: true },
    roles: {
      type: [
        {
          type: Schema.Types.String,
          enum: Object.values(Role),
          default: Role.STUDENT,
        },
      ],
      required: true,
    },
    publicKey: { type: Schema.Types.String, required: true },
  },
  { versionKey: false, timestamps: true },
);

schema.index({ _id: 1, status: 1 });
schema.index({ status: 1 });
schema.index({ userName: 1 });

export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);
