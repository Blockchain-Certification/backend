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
router.use(authentication, role(Role.UNIVERSITY,Role.DOET), authorization);

// get all student
router.get(
  '/',
  validator(schema.query, ValidationSource.QUERY),
  studentController.getList,
);

// get all student of university createdBy
router.get(
  '/createdBy/:id',
  validator(schema.id, ValidationSource.PARAM),
  validator(schema.query, ValidationSource.QUERY),
  authorStudentOfUniversity,
  studentController.getListOfUniversity,
);

// detail student
router.get(
  '/detail/:id',
  validator(schema.id, ValidationSource.PARAM),
  studentController.detail,
);

// search keyword
router.get('/search',
validator(schema.search, ValidationSource.QUERY),
studentController.search);

// author : University created by of student , DOET
// EDIT
router.patch(
  '/:id',
  validator(schema.id, ValidationSource.PARAM),
  validator(schema.edit),
  authorStudentOfUniversity,
  studentController.edit,
);

// author : University created by of student , DOET
// DELETE
router.delete(
  '/:id',
  validator(schema.id, ValidationSource.PARAM),
  authorStudentOfUniversity,
  studentController.delete,
);

export default router;
