import Joi from 'joi';
import { JoiObjectId } from '../../../shared/helpers/validator';
import { fieldShareExtend as requiredFields  } from '../../../common/constant';
export default {
  pagination: Joi.object().keys({
    page: Joi.number().required().integer().min(1),
    limit: Joi.number().required().integer().min(1),
  }),
  idDAC: Joi.object().keys({
    idDAC: JoiObjectId().required(),
  }),

};
