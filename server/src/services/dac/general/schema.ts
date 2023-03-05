import Joi from 'joi';
import { JoiObjectId } from '../../../shared/helpers/validator';
import { ProofData } from './interface';

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
  }),
  idDAC: Joi.object().keys({
    idDAC: JoiObjectId().required(),
  }),
};
