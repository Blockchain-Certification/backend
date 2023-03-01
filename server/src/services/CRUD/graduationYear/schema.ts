import { JoiObjectId } from '../../../shared/helpers/validator';
import Joi from 'joi';

export default {
  create: Joi.object().keys({
    year: Joi.string()
      .regex(/^[1-9][0-9]{3}$/)
      .required(),
  }),
  edit: Joi.object().keys({
    id: Joi.string().required(),
    year: Joi.string()
      .regex(/^[1-9][0-9]{3}$/)
      .required(),
  }),
  pagination: Joi.object().keys({
    page: Joi.number().required().integer().min(1),
    limit: Joi.number().required().integer().min(1),
  }),
  yearId: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
};
