import Joi from 'joi';
import { JoiObjectId } from '../../../shared/helpers/validator';
import { fieldShareExtend as requiredFields } from '../../../common/constant';
export default {
  pagination: Joi.object().keys({
    page: Joi.number().required().integer().min(1),
    limit: Joi.number().required().integer().min(1),
  }),
  idDAC: Joi.object().keys({
    idDAC: JoiObjectId().required(),
  }),
  sharedField: Joi.object().keys({
    sharedField: Joi.string().custom((value,helpers)=>{
      const sharedFields = value.split(',');
      const missingFields = requiredFields.filter(field => !sharedFields.includes(field));
      if (missingFields.length === requiredFields.length) {
        return helpers.error('any.required', { missingFields });
      }
      return value;
    }),
  }),
};
