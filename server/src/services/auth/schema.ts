import Joi from 'joi';
import { Role } from '../../shared/database/model';
export default {
  register: Joi.object().keys({
    userName: Joi.string()
      .required()
      .min(9)
      .max(12)
      .pattern(/^[0-9]+$/),
    password: Joi.string().required().min(6),
    roles: Joi.array()
      .items(Joi.string().valid(...Object.values(Role)))
      .required(),
  }),
};

//.valid([...Object.values(Role)])
