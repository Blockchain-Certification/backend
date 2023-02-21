import { Router } from 'express';
import AuthService from './auth.service';
import { UserRepository } from '../../shared/database/repository';
import AuthController from './auth.controller';
import schema from './schema';
import validator from '../../shared/helpers/validator';
const router = Router();

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.post('/register', validator(schema.register), authController.register);

export default router;
