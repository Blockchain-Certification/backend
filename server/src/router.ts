import { Router } from 'express';
import { user } from './services/index';

const router = Router();

/*---------------------------------------------------------*/
router.use('/users', user);

export default router;
