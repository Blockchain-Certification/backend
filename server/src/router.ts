import { Router } from 'express';
import {
  user,
  auth,
  certificateType,
  graduationCourse,
  graduationYear,
  dac,
  recipentProfile,
} from './services/index';
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
router.use('/users', user);
router.use('/auth', auth);
router.use('/certTypes', certificateType);
router.use('/graduationCourses', graduationCourse);
router.use('/graduationYears', graduationYear);
router.use('/dacs', dac);
router.use('/recipentProfiles', recipentProfile);
export default router;
