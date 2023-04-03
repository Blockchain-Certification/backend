import { Router } from 'express';
import { authentication, authorization } from '../../../shared/middlewares';
import { Role } from '../../../shared/database/model';
import { role } from '../../../shared/helpers/utils';
import {
  CertificateTypeRepository,
  DACRepository,
} from '../../../shared/database/repository';

import validator, { ValidationSource } from '../../../shared/helpers/validator';
import schema from './schema';
import { Controller, Service } from '../base';

const router = Router();
const certTypeRepository = new CertificateTypeRepository();
const dacRepository = new DACRepository();
const certTypeService = new Service(certTypeRepository, dacRepository);
const certTypeController = new Controller(certTypeService);

router.use(authentication, role(Role.DOET), authorization);

router.get(
  '/',
  validator(schema.pagination, ValidationSource.QUERY),
  certTypeController.getList,
);

router.get(
  '/:id',
  validator(schema.certTypeId, ValidationSource.PARAM),
  certTypeController.detail,
);

router.post('/', validator(schema.create), certTypeController.create);

router.put(
  '/:id',
  validator(schema.certTypeId, ValidationSource.PARAM),
  validator(schema.edit),
  certTypeController.edit,
);

router.delete(
  '/:id',
  validator(schema.certTypeId, ValidationSource.PARAM),
  certTypeController.delete,
);


export default router;
