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
      id: Joi.string().required().min(5).max(100),
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
        .required(),
      universityName: Joi.string()
        .required()
        .min(3)
        .max(50)
        .required(),
      departmentName: Joi.string()
        .min(3)
        .max(50)
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
      CGPA: Joi.number().min(0).max(10).required(),
      gender: Joi.string()
        .valid(...Object.values(DACGender))
        .required(),
    }),
  ),
  iUni: Joi.object().keys({
    identityUniversity: Joi.string()
      .required()
      .regex(/^[0-9]{12}$/),
  }),
  iUniAndIdDAC: Joi.object().keys({
    idDAC: JoiObjectId().required(),
    iU: Joi.string()
      .required()
      .regex(/^[0-9]{12}$/),
  }),
  idDAC: Joi.object().keys({
    idDAC: JoiObjectId().required(),
  }),
  updateDAC: Joi.object().keys({
    CGPA: Joi.number().min(0).max(10).required(),
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
    departmentName: Joi.string()
      .min(3)
      .max(50)
      .required(),
  }),
  registrationNum: Joi.array().items(
    Joi.object({
      _id: JoiObjectId().required(),
      registrationNumber: Joi.string().required(),
    }),
  ),
  regisIdNumber: Joi.array().items(
    Joi.object({
      _id: JoiObjectId().required(),
      idNumber: Joi.string().required(),
    }),
  ),
  idNumber: Joi.object().keys({
    idNumber: Joi.string().required(),
  }),
  query: Joi.object().keys({
    page: Joi.number().required().integer().min(1),
    limit: Joi.number().required().integer().min(1),
    dispensingStatus: Joi.boolean().valid().required(),
  }),
  param: Joi.object().keys({
    idDAC: JoiObjectId().required(),
    identityUniversity: Joi.string()
      .required()
      .regex(/^[0-9]{12}$/),
  }),
};
