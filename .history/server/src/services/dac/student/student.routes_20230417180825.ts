import { Router } from 'express';
import {
  InfoUserRepository,
  DACRepository,
} from '../../../shared/database/repository';
import validator, { ValidationSource } from '../../../shared/helpers/validator';
import schema from './schema';
import { authentication, authorization } from '../../../shared/middlewares';
import { role } from '../../../shared/helpers/utils';
import { Role } from '../../../shared/database/model';
import DACStudentService from './student.service';
import DACStudentController from './student.controller';

const router = Router();

const infoUserRepository = new InfoUserRepository();
const dacRepository = new DACRepository();
const dacStudentService = new DACStudentService(
  dacRepository,
  infoUserRepository,
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
dacStudentController.generateProof
)


export default router;
