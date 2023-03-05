import { Router } from 'express';
import asyncHandler from '../helpers/asyncHandler';
import validator, { ValidationSource } from '../helpers/validator';
import schema from './schema';
import { PublicRequest } from '../types/app-request';
import { Header } from '../core/utils';
import { ForbiddenError } from '../core/apiError';
import Logger from '../core/logger';
import { ApiKeyRepository } from '../database/repository';

const router = Router();
export default router.use(
  validator(schema.apiKey, ValidationSource.HEADER),
  asyncHandler(async (req: PublicRequest, res, next) => {
    const key = req.headers[Header.API_KEY]?.toString();
    if (!key) throw new ForbiddenError();

    const apiKey = await ApiKeyRepository.findByKey(key);
    if (!apiKey) throw new ForbiddenError();
    Logger.info(apiKey);

    req.apiKey = apiKey;
    return next();
  }),
);
