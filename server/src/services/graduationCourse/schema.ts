import { JoiObjectId } from '../../shared/helpers/validator';
import Joi from 'joi';
export default {
  create: Joi.object().keys({
    name: Joi.string().required(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().greater(Joi.ref('startDate')).required(),
  }),
  edit: Joi.object().keys({
    id : Joi.string().required(),
    name: Joi.string().required(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().greater(Joi.ref('startDate')).required(),
  }),
  pagination: Joi.object().keys({
    page: Joi.number().required().integer().min(1),
    limit: Joi.number().required().integer().min(1),
  }),
  courseTypeId : Joi.object().keys({
    id : JoiObjectId().required()
  })
};
