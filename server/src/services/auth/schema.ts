import Joi from 'joi';
import { Role, Gender } from '../../shared/database/model';
import { JoiAuthBearer } from '../../shared/helpers/validator';

const now = Date.now();

const dateUpTo6Y = new Date(now - 1000 * 60 * 60 * 24 * 365 * 6); // go back by 6 years
const dateMinimum100Y = new Date(now - 1000 * 60 * 60 * 24 * 365 * 100); // go back by 100 years

export default {
  register: Joi.array().items(
    Joi.object({
      userName: Joi.string()
        .required()
        .min(9)
        .max(12)
        .pattern(/^[0-9]+$/)
        .valid(Joi.ref('identity')),
      password: Joi.string().required().min(6),
      roles: Joi.array()
        .items(Joi.string().valid(...Object.values(Role)))
        .required(),
      name: Joi.string()
        .min(3)
        .max(50)
        .pattern(/^[a-zA-Z ]+$/)
        .required(),
      email: Joi.string().email().required(),
      phone: Joi.string()
        .regex(/^[0-9]{10}$/)
        .required(),
      address: Joi.string().required(),
      dateOfBirth: Joi.date().max(dateUpTo6Y).min(dateMinimum100Y).required(),
      gender: Joi.string()
        .valid(...Object.values(Gender))
        .required(),
      nation: Joi.string().required(),
      identity: Joi.string()
        .required()
        .regex(/^[0-9]{12}$/),
    }),
  ),
  login: Joi.object().keys({
    userName: Joi.string()
      .required()
      .min(9)
      .max(12)
      .pattern(/^[0-9]+$/),
    password: Joi.string().required().min(6),
  }),
  auth: Joi.object().keys({
    access_token: Joi.string().required(),
    Path: Joi.string().required(),
    Expires: Joi.date().required(),
    refresh_token: Joi.string().required(),
  }),
};
