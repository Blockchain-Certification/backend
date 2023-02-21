import { Router } from 'express';
import asyncHandler from '../helpers/asyncHandler';
import { PublicRequest } from '../types/app-request';
import { Response } from 'express';
import { enrollAdmin } from '../fabric';
const router = Router();

export default router.use(
  asyncHandler(async (req: PublicRequest, res: Response, next) => {
    console.log('vao');
    await enrollAdmin();
    return next();
  }),
);
