import Joi from 'joi';
import { Header } from '../core/utils';
import { JoiAuthBearer } from '../helpers/validator';
import { Role } from '../database/model';

export default {
  apiKey: Joi.object()
    .keys({
      [Header.API_KEY]: Joi.string().required(),
    })
    .unknown(true),
  auth: Joi.object()
    .keys({
      [Header.AUTHORIZATION]: JoiAuthBearer().required(),
    })
    .unknown(true),
  currentRoles: Joi.array()
    .items(Joi.string().valid(...Object.values(Role)))
    .required(),
};
