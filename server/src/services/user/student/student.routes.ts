import { Router } from 'express';
import { StudentController } from './student.controller';
import {
  InfoUserRepository,
  DACRepository,
  UserRepository,
} from '../../../shared/database/repository';
import { StudentService } from './student.service';
import validator, { ValidationSource } from '../../../shared/helpers/validator';
import schema from './schema';
import { authentication, authorization } from '../../../shared/middlewares';
import { role } from '../../../shared/helpers/utils';
import { Role } from '../../../shared/database/model';
import { authorStudentOfUniversity } from './utils';

const router = Router();
const infoUserRepository = new InfoUserRepository();
const dacRepository = new DACRepository();
const userRepository = new UserRepository();
const userService = new StudentService(
  infoUserRepository,
  userRepository,
  dacRepository,
);
const studentController = new StudentController(userService);
router.use(authentication, role(Role.UNIVERSITY), authorization);

router.get(
  '/',
  validator(schema.query, ValidationSource.QUERY),
  studentController.getList,
);

router.get(
  '/:id',
  validator(schema.userId, ValidationSource.PARAM),
  authorStudentOfUniversity,
  studentController.detail,
);

// consider
router.patch(
  '/:id',
  validator(schema.userId, ValidationSource.PARAM),
  validator(schema.edit),
  authorStudentOfUniversity,
  studentController.edit,
);

router.delete(
  '/:id',
  validator(schema.userId, ValidationSource.PARAM),
  authorStudentOfUniversity,
  studentController.delete,
);

export default router;
