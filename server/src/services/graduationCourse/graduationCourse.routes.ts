import { Router } from 'express';
import { authentication, authorization,checkUpToBlockchain } from '../../shared/middlewares';
import { Role } from '../../shared/database/model';
import { role } from '../../shared/helpers/utils';
import validator, { ValidationSource } from '../../shared/helpers/validator';
import schema from './schema';
import {
  GraduationCourseRepository,
  DACRepository,
} from '../../shared/database/repository';
import { Controller, Service } from '../../common/abtractService';
import { TYPE_COURSE } from '../../common/constant';


const router = Router();
const graduationCourseRepo = new GraduationCourseRepository();
const dacRepository = new DACRepository();
const graduationService = new Service(graduationCourseRepo, dacRepository);
const graduationCourseController = new Controller(graduationService);


router.get(
  '/',
  validator(schema.pagination, ValidationSource.QUERY),
  authentication, role(Role.DOET,Role.UNIVERSITY), authorization,
  graduationCourseController.getList,
);




router.get(
  '/:id',
  validator(schema.courseTypeId, ValidationSource.PARAM),
  graduationCourseController.detail,
);

router.post('/', validator(schema.create), graduationCourseController.create);


router.use(authentication, role(Role.DOET), authorization);


router.put(
  '/:id',
  validator(schema.courseTypeId, ValidationSource.PARAM),
  validator(schema.edit),
  checkUpToBlockchain(TYPE_COURSE),
  graduationCourseController.edit,
);

router.delete(
  '/:id',
  validator(schema.courseTypeId, ValidationSource.PARAM),
  checkUpToBlockchain(TYPE_COURSE),
  graduationCourseController.delete,
);
export default router;