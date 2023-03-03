import { Router } from 'express';
import {  UniversityController } from './university.controller';
import {
  InfoUserRepository,
  DACRepository,
  UserRepository,
} from '../../../shared/database/repository';
import { UniversityService } from './university.service';
import validator, { ValidationSource } from '../../../shared/helpers/validator';
import schema from './schema';
import { authentication, authorization } from '../../../shared/middlewares';
import { role } from '../../../shared/helpers/utils';
import { Role } from '../../../shared/database/model';

const router = Router();
const infoUserRepository = new InfoUserRepository();
const dacRepository = new DACRepository();
const userRepository = new UserRepository();
const userService = new UniversityService(
  infoUserRepository,
  userRepository,
  dacRepository,
);
const universityController = new UniversityController(userService);
router.use(authentication, role(Role.UNIVERSITY,Role.DOET), authorization);

// get all student
router.get(
  '/',
  validator(schema.query, ValidationSource.QUERY),
  universityController.getList,
);


// detail student
router.get(
  '/detail/:id',
  validator(schema.id, ValidationSource.PARAM),
  universityController.detail,
);

// search keyword
router.get('/search',
validator(schema.search, ValidationSource.QUERY),
universityController.search);

export default router;
