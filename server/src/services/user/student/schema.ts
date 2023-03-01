import Joi from 'joi';
import { JoiObjectId } from '../../../shared/helpers/validator';
import { Gender, Role } from '../../../shared/database/model';
import { dateUpTo6Y, dateMinimum100Y } from '../../auth/schema';
export default {
  query: Joi.object().keys({
    page: Joi.number().required().integer().min(1),
    limit: Joi.number().required().integer().min(1)
  }),
  userId: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  edit : Joi.object().keys({
    phone: Joi.string().regex(/^[0-9]{10}$/),
    address: Joi.string(),
    dateOfBirth: Joi.date().max(dateUpTo6Y).min(dateMinimum100Y),
    gender: Joi.string().valid(...Object.values(Gender)),
    nation: Joi.string(),
  }),
};
