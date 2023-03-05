import Joi from 'joi';
import { Type } from '../../../shared/database/model/CertificateType';
import { JoiObjectId } from '../../../shared/helpers/validator';
export default {
  create: Joi.object().keys({
    name: Joi.string().required(),
    type: Joi.string()
      .valid(...Object.values(Type))
      .required(),
    level: Joi.when('type', {
      is: 'DIPLOMA',
      then: Joi.string().allow(null),
      otherwise: Joi.number().integer().min(1).required(),
    }).custom((value, helpers) => {
      const dataReq = helpers.state.ancestors[0];
      if (dataReq.type === 'DIPLOMA' && value !== null) {
        return helpers.error('any.invalid');
      }
      return value;
    }),
  }),
  edit : Joi.object().keys({
    id : Joi.string().required(),
    name: Joi.string().required(),
    type: Joi.string()
      .valid(...Object.values(Type))
      .required(),
    level: Joi.when('type', {
      is: 'DIPLOMA',
      then: Joi.string().allow(null),
      otherwise: Joi.number().integer().min(1).required(),
    }).custom((value, helpers) => {
      const dataReq = helpers.state.ancestors[0];
      if (dataReq.type === 'DIPLOMA' && value !== null) {
        return helpers.error('any.invalid');
      }
      return value;
    }),
  }),
  pagination: Joi.object().keys({
    page: Joi.number().required().integer().min(1),
    limit: Joi.number().required().integer().min(1),
  }),
  certTypeId : Joi.object().keys({
    id : JoiObjectId().required()
  })

};
