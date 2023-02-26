import { Router } from 'express';
import { ProtectedRequest } from 'app-request';
import { AuthFailureError } from '../core/apiError';
import { Role } from '../database/model';
import asyncHandler from '../helpers/asyncHandler';
const router = Router();

export default router.use(
  asyncHandler(async (req: ProtectedRequest, res, next) => {
    const validateUser = !req.user || !req.user.roles || !req.currentRoles;
    if (validateUser) throw new AuthFailureError('Permission denied');

    const matchingRoles = Object.entries(Role).filter(([key, value]) =>
      req.currentRoles.includes(value),
    );
    const roles = matchingRoles.map(([key, value]) => value);
    if (roles.length === 0) throw new AuthFailureError('Permission denied');
    console.log(roles);
    console.log(req.user.roles);
    const authorized = roles.filter((role) => req.user.roles.includes(role));
    if (authorized.length === 0)
      throw new AuthFailureError('Permission denied');

    return next();
  }),
);
