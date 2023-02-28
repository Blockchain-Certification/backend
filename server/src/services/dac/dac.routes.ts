import { Router } from 'express';
import { authentication, authorization } from '../../shared/middlewares';
import { Role } from '../../shared/database/model';
import { role } from '../../shared/helpers/utils';
import validator, { ValidationSource } from '../../shared/helpers/validator';
import schema from './schema';

const router = Router();




export default router;
