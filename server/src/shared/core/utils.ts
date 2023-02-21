import rateLimit from 'express-rate-limit';
import asyncHandler from '../helpers/asyncHandler';
import { PublicRequest } from '../types/app-request';
import { Response } from 'express';
import { enrollAdmin } from '../fabric';
import { Router } from 'express';

const router = Router();

export const enum Header {
  API_KEY = 'x-api-key',
  AUTHORIZATION = 'authorization',
}

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

export const fabricLoader = enrollAdmin();
