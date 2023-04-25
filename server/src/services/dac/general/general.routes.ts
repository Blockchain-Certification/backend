import { Router } from 'express';
import {
  InfoUserRepository,
  DACRepository,
} from '../../../shared/database/repository';
import DACGeneralService from './general.service';
import DACGeneralController from './general.controller';

const router = Router();

const infoUserRepository = new InfoUserRepository();
const dacRepository = new DACRepository();
const dacGeneralService = new DACGeneralService(
  dacRepository,
  infoUserRepository,
);

const dacGeneralController = new DACGeneralController(dacGeneralService);

router.post('/verify', dacGeneralController.verify);

export default router;
