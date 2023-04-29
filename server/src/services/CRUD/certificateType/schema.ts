import Joi from 'joi';
import { Type } from '../../../shared/database/model/CertificateType';
import { JoiObjectId } from '../../../shared/helpers/validator';
export default {
  create: Joi.object().keys({
    name: Joi.string().required(),
    type: Joi.string()
      .valid(...Object.values(Type))
      .required(),
    level: Joi.number().required().integer().min(0) ,
  }),
  edit : Joi.object().keys({
    id : Joi.string().required(),
    name: Joi.string().required(),
    type: Joi.string()
      .valid(...Object.values(Type))
      .required(),
    level: Joi.number().required().integer().min(0),
  }),
  pagination: Joi.object().keys({
    page: Joi.number().required().integer().min(1),
    limit: Joi.number().required().integer().min(1),
  }),
  certTypeId : Joi.object().keys({
    id : JoiObjectId().required()
  })
  

};
