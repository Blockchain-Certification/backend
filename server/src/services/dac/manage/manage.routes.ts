import { Router } from 'express';
import { authentication, authorization } from '../../../shared/middlewares';
import { Role } from '../../../shared/database/model';
import { role } from '../../../shared/helpers/utils';
import validator, { ValidationSource } from '../../../shared/helpers/validator';
import schema from './schema';
import ManageDACService from './manage.service';
import { DACRepository } from '../../../shared/database/repository/dac.repository';
import ManageDACController from './manage.controller';
import { authorizationUniversity } from '../../../shared/middlewares';
import {
  CertificateTypeRepository,
  InfoUserRepository,
} from '../../../shared/database/repository';
import { cacheAside } from '../../../shared/middlewares/cacheMiddleWare';
const router = Router();

const dacRepository = new DACRepository();
const certificateTypeRepository = new CertificateTypeRepository();
const infoUserRepository = new InfoUserRepository();
const dacService = new ManageDACService(
  dacRepository,
  certificateTypeRepository,
  infoUserRepository,
);
const manageDACController = new ManageDACController(dacService);

router.patch(
  '/:identityUniversity/issue',
  authentication,
  role(Role.UNIVERSITY),
  authorization,
  authorizationUniversity,
  validator(schema.iUni, ValidationSource.PARAM),
  validator(schema.issue),
  manageDACController.issue,
);



router.get(
  '/:identityUniversity',
  authentication,
  role(Role.UNIVERSITY,Role.DOET),
  authorization,
  authorizationUniversity,
  validator(schema.iUni, ValidationSource.PARAM),
  validator(schema.pagination, ValidationSource.QUERY),
  cacheAside,
  manageDACController.getListDACOfUniversity,
);


router.get(
  '/:identityUniversity/detail/:idDAC',
  authentication,
  role(Role.UNIVERSITY,Role.DOET),
  authorization,
  authorizationUniversity,
  validator(schema.iUni, ValidationSource.PARAM),
  manageDACController.detail,
);


export default router;
