import { Router } from 'express';
import { authentication, authorization } from '../../shared/middlewares';
import { Role } from '../../shared/database/model';
import { role } from '../../shared/helpers/utils';
import validator, { ValidationSource } from '../../shared/helpers/validator';
import schema from './schema';
import {
  GraduationYearRepository,
  DACRepository,
} from '../../shared/database/repository';
import { Controller, Service } from '../../common/abtractService';

const router = Router();
const graduationYearRepo = new GraduationYearRepository();
const dacRepository = new DACRepository();
const graduationYearService = new Service(graduationYearRepo, dacRepository);
const graduationYearController = new Controller(graduationYearService);


router.get(
  '/',
  authentication,
  role(Role.UNIVERSITY, Role.DOET),
  authorization,
  role(Role.DOET, Role.),
  validator(schema.pagination, ValidationSource.QUERY),
  graduationYearController.getList,
);


router.use(authentication, role(Role.DOET), authorization);

router.get(
  '/:id',
  validator(schema.yearId, ValidationSource.PARAM),
  graduationYearController.detail,
);

router.post('/', validator(schema.create), graduationYearController.create);

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
