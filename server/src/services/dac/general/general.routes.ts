import { Router } from 'express';
import {
  InfoUserRepository,
  DACRepository,
} from '../../../shared/database/repository';
import DACGeneralService from './general.service';
import DACGeneralController from './general.controller';
import { dacStudentService } from '../student/student.routes';
const router = Router();

const infoUserRepository = new InfoUserRepository();
const dacRepository = new DACRepository();
const dacGeneralService = new DACGeneralService(
  dacRepository,
  infoUserRepository,
);
const dacGeneralController = new DACGeneralController(dacGeneralService,dacStudentService);

router.post('/verify', dacGeneralController.verify);
router.get('/generateProof/:idDAC/:identityStudent', dacGeneralController.generateProof);

export default router;
