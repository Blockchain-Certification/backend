import rateLimit from 'express-rate-limit';

import { enrollAdmin } from '../fabric';

export const enum Header {
  API_KEY = 'x-api-key',
  AUTHORIZATION = 'authorization',
}

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000000000000000, // limit each IP to 100 requests per windowMs
});

export const fabricLoader = enrollAdmin();
