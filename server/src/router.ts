import { Router } from 'express';
import { user, auth } from './services/index';
const router = Router();
/*---------------------------------------------------------*/

router.use('/users', user);
router.use('/auth', auth);
export default router;
