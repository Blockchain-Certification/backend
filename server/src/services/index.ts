import user from './user/user.router';
import { auth } from './auth';
import {
  graduationYear,
  certificateType,
  graduationCourse,
} from './CRUD/ index';
import dac from './dac/dac.router';
import { recipientProfile } from './recipientProfile';
export {
  user,
  auth,
  certificateType,
  graduationCourse,
  graduationYear,
  dac,
  recipientProfile,
};
