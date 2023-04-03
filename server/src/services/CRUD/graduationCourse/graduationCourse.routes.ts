import { Router } from 'express';
import { authentication, authorization } from '../../../shared/middlewares';
import { Role } from '../../../shared/database/model';
import { role } from '../../../shared/helpers/utils';
import validator, { ValidationSource } from '../../../shared/helpers/validator';
import schema from './schema';
import {
  GraduationCourseRepository,
  DACRepository,
} from '../../../shared/database/repository';
import { Service, Controller } from '../base';

const router = Router();
const graduationCourseRepo = new GraduationCourseRepository();
const dacRepository = new DACRepository();
const graduationService = new Service(graduationCourseRepo, dacRepository);
const graduationCourseController = new Controller(graduationService);

router.use(authentication, role(Role.UNIVERSITY), authorization);

router.get(
  '/',
  validator(schema.pagination, ValidationSource.QUERY),
  graduationCourseController.getList,
);


router.get(
  '/:id',
  validator(schema.courseTypeId, ValidationSource.PARAM),
  graduationCourseController.detail,
);

router.post('/', validator(schema.create), graduationCourseController.create);


router.put(
  '/:id',
  validator(schema.courseTypeId, ValidationSource.PARAM),
  validator(schema.edit),
  graduationCourseController.edit,
);

router.delete(
  '/:id',
  validator(schema.courseTypeId, ValidationSource.PARAM),
  graduationCourseController.delete,
);
export default router;
