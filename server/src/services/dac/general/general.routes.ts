import { Router } from 'express';
import {
  InfoUserRepository,
  DACRepository,
} from '../../../shared/database/repository';
import DACGeneralService from './general.service';
import DACGeneralController from './general.controller';
import { dacStudentService } from '../student/student.routes';
import validator from '../../../shared/helpers/validator';
import schema from './schema';
import CryptoVerifyRepository from '../../../shared/database/repository/cryptoVerify.repository';
const router = Router();

const infoUserRepository = new InfoUserRepository();
const dacRepository = new DACRepository();
const cryptoVerifyRepository = new CryptoVerifyRepository();
const dacGeneralService = new DACGeneralService(
  dacRepository,
  cryptoVerifyRepository,
  dacStudentService,
);
const dacGeneralController = new DACGeneralController(dacGeneralService,dacStudentService);

router.post('/verify', dacGeneralController.verify);
router.get('/generateProof/:idDAC/:identityStudent', dacGeneralController.generateProof);
router.post('/verifyCrypto', validator(schema.verifyCrypto), dacGeneralController.verifyCrypto);
export default router;
