import Joi from 'joi';
import { dateUpTo6Y, dateMinimum100Y } from '../auth/schema';
import {
  Ranking,
  FormOfTraining,
  DACGender,
} from '../../shared/database/model/DAC';
import { JoiObjectId } from '../../shared/helpers/validator';
export default {
  recipentProfile: Joi.array().items(
    Joi.object({
      iU: Joi.string()
        .required()
        .regex(/^[0-9]{12}$/),
      iSt: Joi.string()
        .required()
        .regex(/^[0-9]{12}$/),
      studentName: Joi.string()
        .required()
        .min(3)
        .max(50)
        .pattern(/^[a-zA-Z ]+$/)
        .required(),
      universityName: Joi.string()
        .required()
        .min(3)
        .max(50)
        .pattern(/^[a-zA-Z ]+$/)
        .required(),
      dateOfBirth: Joi.date().max(dateUpTo6Y).min(dateMinimum100Y).required(),
      year: Joi.string()
        .required()
        .regex(/^[1-9][0-9]{3}$/),
      nameCourse: Joi.string().required(),
      major: Joi.string().required(),
      placeOfBirth: Joi.string().required(),
      nation: Joi.string().required(),
      ranking: Joi.string()
        .valid(...Object.values(Ranking))
        .required(),
      formOfTraining: Joi.string()
        .valid(...Object.values(FormOfTraining))
        .required(),
      CPGA: Joi.number().min(0).max(10).required(),
      gender: Joi.string()
        .valid(...Object.values(DACGender))
        .required(),
    }),
  ),
  iUni: Joi.object().keys({
    identity: Joi.string()
      .required()
      .regex(/^[0-9]{12}$/),
  }),
  iUniAndIdDAC: Joi.object().keys({
    idDAC: JoiObjectId().required(),
    iU: Joi.string()
      .required()
      .regex(/^[0-9]{12}$/),
  }),
  updateDAC: Joi.object().keys({
    CPGA: Joi.number().min(0).max(10).required(),
    formOfTraining: Joi.string()
      .valid(...Object.values(FormOfTraining))
      .required(),
    ranking: Joi.string()
      .valid(...Object.values(Ranking))
      .required(),
    year: Joi.string()
      .required()
      .regex(/^[1-9][0-9]{3}$/),
    nameCourse: Joi.string().required(),
    major: Joi.string().required(),
  }),
};
