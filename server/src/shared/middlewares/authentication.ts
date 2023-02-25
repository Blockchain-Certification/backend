import asyncHandler from '../helpers/asyncHandler';
import { ProtectedRequest } from '../types/app-request';
import { Router } from 'express';
import { KeyStoreRepository, UserRepository } from '../database/repository';
import JWT from '../core/JWT';
import { TokenExpiredError } from 'jsonwebtoken';
import { AccessTokenError, AuthFailureError } from '../core/apiError';
import { validateTokenData } from '../helpers/jwt.utils';
validateTokenData;
const router = Router();
const userRepository = new UserRepository();
const keyStoreRepository = new KeyStoreRepository();

router.use(
  asyncHandler(async (req: ProtectedRequest, res, next) => {
    const accessToken = req.cookies.access_token;

    try {
      const accessTokenPayload = await JWT.validate(accessToken);
      await validateTokenData(accessTokenPayload);

      const user = await userRepository.findById(accessTokenPayload.sub);
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
