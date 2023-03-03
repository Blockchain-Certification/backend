import { Router } from 'express';
import { authentication, authorization } from '../../shared/middlewares';
import {
  DACRepository,
  InfoUserRepository,
  UserRepository,
  GraduationCourseRepository,
  GraduationYearRepository,
  CertificateTypeRepository,
} from '../../shared/database/repository';
import { Role } from '../../shared/database/model';
import { role } from '../../shared/helpers/utils';
import validator, { ValidationSource } from '../../shared/helpers/validator';
import schema from './schema';
import RecipentProfileService from './recipientProfile.service';
import RecipentProfileController from './recipientProfile.controller';
import {authorizationRecipientProfile} from './utils';

const dacRepository = new DACRepository();
const infoUserRepository = new InfoUserRepository();
const userRepository = new UserRepository();
const graduationCourseRepository = new GraduationCourseRepository();
const graduationYearRepository = new GraduationYearRepository();
const certificateTypeRepository = new CertificateTypeRepository();
const recipentProfileService = new RecipentProfileService(
  dacRepository,
  infoUserRepository,
  userRepository,
  graduationCourseRepository,
  graduationYearRepository,
  certificateTypeRepository,
);
const recipentProfileController = new RecipentProfileController(
  recipentProfileService,
);

const router = Router();

// GET DAC OF UNIVERSITY
router.get(
  '/:identityUniversity',
  authentication,
  role(Role.UNIVERSITY, Role.DOET),
  authorization,
  validator(schema.query, ValidationSource.QUERY),
  validator(schema.iUni, ValidationSource.PARAM),
  recipentProfileController.getList,
);

// GET DETAIL DAC
router.get(
  '/:identityUniversity/detail/:idDAC',
  authentication,
  role(Role.UNIVERSITY, Role.DOET),
  authorization,
  validator(schema.param, ValidationSource.PARAM),
  authorizationRecipientProfile,
  recipentProfileController.detail,
);

//CREATE OF UNIVERSITY
router.post(
  '/:identityUniversity',
  authentication,
  role(Role.UNIVERSITY),
  authorization,
  validator(schema.recipentProfile),
  validator(schema.iUni, ValidationSource.PARAM),
  authorizationRecipientProfile,
  recipentProfileController.create,
);

// DOET UPDATE IDNUMBER  OF UNIVERSITY
router.patch(
  '/:identityUniversity/regisIdNumber',
  authentication,
  role(Role.UNIVERSITY),
  authorization,
  validator(schema.iUni, ValidationSource.PARAM),
  validator(schema.regisIdNumber),
  authorizationRecipientProfile,
  recipentProfileController.regisIdNumber,
);

// DOET UPDATE INFO DAC
router.patch(
  '/:identityUniversity/updateInfo/:idDAC',
  authentication,
  role(Role.DOET),
  authorization,
  validator(schema.param, ValidationSource.PARAM),
  validator(schema.updateDAC),
  recipentProfileController.updateInfoDAC,
);

// DOET UPDATE REGISRATION NUNMBER
router.patch(
  '/:identityUniversity/registrationNumber',
  authentication,
  role(Role.DOET),
  authorization,
  validator(schema.iUni, ValidationSource.PARAM),
  validator(schema.registrationNum),
  recipentProfileController.registrationNumber,
);

// delete DAC of DOET
router.delete(
  '/:identityUniversity/delete/:idDAC',
  authentication,
  role(Role.DOET),
  authorization,
  validator(schema.param, ValidationSource.PARAM),
  recipentProfileController.delete,
);

export default router;
