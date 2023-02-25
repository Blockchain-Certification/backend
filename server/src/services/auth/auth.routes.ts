import { Router } from 'express';
import AuthService from './auth.service';
import {
  UserRepository,
  InfoUserRepository,
  KeyStoreRepository,
} from '../../shared/database/repository';
import { MailNodeMailerProvider } from '../../shared/helpers/mailer/nodemailer';
import AuthController from './auth.controller';
import schema from './schema';
import validator, { ValidationSource } from '../../shared/helpers/validator';
import { authorization, authentication } from '../../shared/middlewares';
import { role } from '../../shared/helpers/utils';
import { Role } from '../../shared/database/model';

const router = Router();

const userRepository = new UserRepository();
const infoUserRepository = new InfoUserRepository();
const keyStoreRepository = new KeyStoreRepository();
const mailNodeMailerProvider = new MailNodeMailerProvider();
const authService = new AuthService(
  userRepository,
  infoUserRepository,
  keyStoreRepository,
  mailNodeMailerProvider,
);
const authController = new AuthController(authService);

router.post(
  '/register',
  authentication,
  role(Role.UNIVERSITY, Role.DOET),
  authorization,
  validator(schema.register),
  authController.register,
);

router.post('/', validator(schema.login), authController.login);

router.post(
  '/refresh',
  validator(schema.auth, ValidationSource.COOKIES),
  authController.refreshToken,
);

router.delete(
  '/logout',
  validator(schema.auth, ValidationSource.COOKIES),
  authentication,
  authController.logout,
);

export default router;
