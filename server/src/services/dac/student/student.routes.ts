import { Router } from 'express';
import {
  InfoUserRepository,
  DACRepository,
  CryptoVerifyRepository
} from '../../../shared/database/repository';
import validator, { ValidationSource } from '../../../shared/helpers/validator';
import schema from './schema';
import { authentication, authorization } from '../../../shared/middlewares';
import { role } from '../../../shared/helpers/utils';
import { Role } from '../../../shared/database/model';
import DACStudentService from './student.service';
import DACStudentController from './student.controller';
import { authorizationAccessDAC } from '../../../shared/middlewares/authorizationAccessDAC';

const router = Router();

const infoUserRepository = new InfoUserRepository();
const dacRepository = new DACRepository();
const cryptoVerifyRepository = new CryptoVerifyRepository();
export const dacStudentService = new DACStudentService(
  dacRepository,
  infoUserRepository,
  cryptoVerifyRepository,
);
const dacStudentController = new DACStudentController(dacStudentService);

router.use(authentication, role(Role.STUDENT), authorization);

router.get(
  '/',
  validator(schema.pagination, ValidationSource.QUERY),
  dacStudentController.getListDACOfStudent
);

router.get('/generateProof/:idDAC',
validator(schema.idDAC,ValidationSource.PARAM),
validator(schema.sharedField,ValidationSource.QUERY),
dacStudentController.generateProof
)

router.get(
  '/detail/:idDAC',
  authorizationAccessDAC,
  dacStudentController.detail,
);


export default router;
