import { Router } from 'express';
import { user, auth,certificateType } from './services/index';
import permission from './shared/middlewares/permission';
import { Permission } from './shared/database/model/ApiKey';
import apiKey from './shared/middlewares/apiKey';

const router = Router();

/*---------------------------------------------------------*/
router.use(apiKey);
/*---------------------------------------------------------*/
/*---------------------------------------------------------*/
router.use(permission(Permission.GENERAL));
/*---------------------------------------------------------*/
router.use('/user', user);
router.use('/auth', auth);
router.use('/certType',certificateType);
export default router;
