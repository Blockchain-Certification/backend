import { model, Schema, Types, Document } from 'mongoose';
import bcrypt from 'bcrypt';

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
  isValidPassword(password: string): Promise<boolean>;
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
    publicKey: { type: Schema.Types.String, required: false, default: '' },
  },
  { versionKey: false, timestamps: true },
);

schema.index({ _id: 1, status: 1 });
schema.index({ status: 1 });
schema.index({ userName: 1 });

schema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

schema.methods.isValidPassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);
