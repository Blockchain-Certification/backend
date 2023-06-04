import Joi from 'joi';
import { JoiObjectId } from '../../../shared/helpers/validator';

const allowedFields = [
  'universityName',
  'major',
  'departmentName',
  'CGPA',
  'formOfTraining',
  'ranking',
];

export default {
  verify: Joi.object().keys({
    proof: Joi.array()
      .items(
        Joi.object({
          type: Joi.string().required(),
          data: Joi.array().items(Joi.number()).required(),
        }),
      )
      .required(),
    disclosedData: Joi.object()
      .keys({
        _id : JoiObjectId().required(),
        universityName: Joi.string().required(),
        major: Joi.string(),
        departmentName: Joi.string(),
        CGPA: Joi.string(),
        formOfTraining: Joi.string(),
        ranking: Joi.string(),
      })
      .unknown(false)
      .or(...allowedFields),
    dacID: JoiObjectId().required(),
    key :Joi.string(),
    
  }),
  idDAC: Joi.object().keys({
    idDAC: JoiObjectId().required(),
  }),
  verifyCrypto: Joi.object().keys({
    identity: Joi.string()
    .required()
    .regex(/^[0-9]{12}$/),
    name: Joi.string().required(),
    idDAC: Joi.string().required(),
    key: Joi.string()
    .regex(/^[0-9]{10}$/)
    .required(),
  })
};
