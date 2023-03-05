import { Router } from 'express';
import { authentication, authorization } from '../../../shared/middlewares';
import { Role } from '../../../shared/database/model';
import { role } from '../../../shared/helpers/utils';
import validator, { ValidationSource } from '../../../shared/helpers/validator';
import schema from './schema';
import {
  GraduationYearRepository,
  DACRepository,
} from '../../../shared/database/repository';
import { Service, Controller } from '../base';

const router = Router();
const graduationYearRepo = new GraduationYearRepository();
const dacRepository = new DACRepository();
const graduationYearService = new Service(graduationYearRepo, dacRepository);
const graduationYearController = new Controller(graduationYearService);

router.use(authentication, role(Role.DOET), authorization);

router.post('/', validator(schema.create), graduationYearController.create);

router.get(
  '/',
  validator(schema.pagination, ValidationSource.QUERY),
  graduationYearController.getList,
);

router.put(
  '/:id',
  validator(schema.yearId, ValidationSource.PARAM),
  validator(schema.edit),
  graduationYearController.edit,
);

router.delete(
  '/:id',
  validator(schema.yearId, ValidationSource.PARAM),
  graduationYearController.delete,
);
export default router;
