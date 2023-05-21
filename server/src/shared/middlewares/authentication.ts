import asyncHandler from '../helpers/asyncHandler';
import { ProtectedRequest } from '../types/app-request';
import { Router } from 'express';
import { KeyStoreRepository, UserRepository } from '../database/repository';
import JWT from '../core/JWT';
import { TokenExpiredError } from 'jsonwebtoken';
import { AccessTokenError, AuthFailureError } from '../core/apiError';
import { validateTokenData } from '../helpers/jwt.utils';
import { Types } from 'mongoose';
const router = Router();
const userRepository = new UserRepository();
const keyStoreRepository = new KeyStoreRepository();

router.use(
  asyncHandler(async (req: ProtectedRequest, res, next) => {
    const headers = req.headers.authorization;
    if(!headers)
      throw new  AuthFailureError('Invalid authorization header')
    const accessToken = headers.split(' ')[1];
    try {
      const accessTokenPayload = await JWT.validate(accessToken);
      await validateTokenData(accessTokenPayload);

      const user = await userRepository.findById(new Types.ObjectId(accessTokenPayload.sub));
      if (!user) throw new AuthFailureError(' User not registered');
      req.user = user;

      const keyStore = await keyStoreRepository.findforKey(
        req.user,
        accessTokenPayload.prm,
      );
      if (!keyStore) throw new AuthFailureError('Invalid access token');
      req.keyStore = keyStore;
      return next();
    } catch (e) {
      if (e instanceof TokenExpiredError) throw new AccessTokenError(e.message);
      throw e;
    }
  }),
);

export default router;
