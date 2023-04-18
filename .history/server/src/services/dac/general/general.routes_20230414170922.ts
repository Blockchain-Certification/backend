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
import DACGeneralService from './general.service';
import DACGeneralController from './general.controller';
import { verify } from 'jsonwebtoken';

const router = Router();

const infoUserRepository = new InfoUserRepository();
const dacRepository = new DACRepository();
const dacGeneralService = new DACGeneralService(
  dacRepository,
  infoUserRepository,
);

const dacGeneralController = new DACGeneralController(dacGeneralService);

router.post('/verify', validator(schema.verify), dacGeneralController.verify);

export default router;
