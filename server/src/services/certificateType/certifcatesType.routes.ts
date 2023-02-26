import { Router } from 'express';
import { authentication, authorization } from '../../shared/middlewares';
import { Role } from '../../shared/database/model';
import { role } from '../../shared/helpers/utils';
import { CertificateTypeService, CertificateTypeController } from './index';
import { CertificateTypeRepository,DACRepository } from '../../shared/database/repository';
import validator, { ValidationSource } from '../../shared/helpers/validator';
import schema from './schema';
const router = Router();
const certTypeRepository = new CertificateTypeRepository();
const dacRepository = new DACRepository();
const certTypeService = new CertificateTypeService(certTypeRepository,dacRepository);
const certTypeController = new CertificateTypeController(certTypeService);

router.use(authentication, role(Role.DOET, Role.UNIVERSITY), authorization);

router.get(
  '/',
  validator(schema.pagination, ValidationSource.QUERY),
  certTypeController.getList,
);

router.post('/', validator(schema.create), certTypeController.create);

router.put(
  '/:id',
  validator(schema.certTypeId, ValidationSource.PARAM),
  validator(schema.create),
  certTypeController.edit,
);

router.delete('/:id',  validator(schema.certTypeId, ValidationSource.PARAM),certTypeController.delete)
export default router;
