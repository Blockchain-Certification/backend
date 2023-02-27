import { Router } from 'express';
import { UserController } from './user.controller';
import {
  InfoUserRepository,
  DACRepository,
  UserRepository,
} from '../../shared/database/repository/';
import { UserService } from './user.service';
import { Service } from '../CRUD';
import { authentication, authorization } from '../../shared/middlewares';
import { role } from '../../shared/helpers/utils';
import { Role } from '../../shared/database/model';
import validator, { ValidationSource } from '../../shared/helpers/validator';
import schema from './schema';

const router = Router();
const infoUserRepository = new InfoUserRepository();
const dacRepository = new DACRepository();
const userRepository = new UserRepository();
const userService = new UserService(
  infoUserRepository,
  userRepository,
  dacRepository,
);
const userController = new UserController(userService);

router.use(authentication, role(Role.DOET), authorization);

router.get(
  '/',
  validator(schema.query, ValidationSource.QUERY),
  userController.getList,
);

router.patch(
  '/:id',
  validator(schema.userId, ValidationSource.PARAM),
  validator(schema.edit),
  userController.edit,
);

router.delete(
  '/:id',
  validator(schema.userId, ValidationSource.PARAM),
  userController.delete,
);
export default router;
