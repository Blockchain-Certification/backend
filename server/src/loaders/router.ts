import { Router } from 'express';
import {
  user,
  auth,
  certificateType,
  graduationCourse,
  graduationYear,
  dac,
  recipientProfile,
} from '../services/index';
import permission from '../shared/middlewares/permission';
import { Permission } from '../shared/database/model/ApiKey';
import apiKey from '../shared/middlewares/apiKey';

const router = Router();

/*---------------------------------------------------------*/
router.use(apiKey);
/*---------------------------------------------------------*/
/*---------------------------------------------------------*/
router.use(permission(Permission.GENERAL));
/*---------------------------------------------------------*/
router.get('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '1800');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'PUT, POST, GET, DELETE, PATCH, OPTIONS',
  );
});
router.use('/users', user);
router.use('/auth', auth);
router.use('/certTypes', certificateType);
router.use('/graduationCourses', graduationCourse);
router.use('/graduationYears', graduationYear);
router.use('/dac', dac);
router.use('/recipientProfiles', recipientProfile);

export default router;
