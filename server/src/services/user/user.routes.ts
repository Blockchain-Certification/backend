import { Router } from 'express';
import { UserController } from './user.controller';
import { UserRepository } from '../../shared/database/repository/';
import { UserService } from './user.service';

const router = Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.get('/', userController.getList);

export default router;
