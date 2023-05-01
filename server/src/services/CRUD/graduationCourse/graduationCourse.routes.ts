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


router.get(
  '/',
  validator(schema.pagination, ValidationSource.QUERY),
  authentication, role(Role.DOET,Role.UNIVERSITY), authorization,
  certTypeController.getList,
);

router.get(
  '/:id',
  validator(schema.certTypeId, ValidationSource.PARAM),
  authentication, role(Role.DOET), authorization,
  certTypeController.detail,
);

router.post('/', validator(schema.create), certTypeController.create);

router.put(
  '/:id',
  validator(schema.certTypeId, ValidationSource.PARAM),
  validator(schema.edit),
  authentication, role(Role.DOET), authorization,
  certTypeController.edit,
);

router.delete(
  '/:id',
  validator(schema.certTypeId, ValidationSource.PARAM),
  authentication, role(Role.DOET), authorization,
  certTypeController.delete,
);


export default router;
