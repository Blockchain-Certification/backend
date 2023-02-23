import { Router } from 'express';
import AuthService from './auth.service';
import {
  UserRepository,
  InfoUserRepository,
  KeyStoreRepository
} from '../../shared/database/repository';
import AuthController from './auth.controller';
import schema from './schema';
import validator from '../../shared/helpers/validator';
const router = Router();

const userRepository = new UserRepository();
const infoUserRepository = new InfoUserRepository();
const keyStoreRepository = new KeyStoreRepository();
const authService = new AuthService(userRepository, infoUserRepository,keyStoreRepository);
const authController = new AuthController(authService);

router.post('/register', validator(schema.register), authController.register);
router.post('/',validator(schema.login), authController.login);

export default router;
