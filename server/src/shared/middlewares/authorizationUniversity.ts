import { AuthFailureError } from '../../shared/core/apiError';
import asyncHandler from '../../shared/helpers/asyncHandler';
import { ProtectedRequest } from 'app-request';
import { Role } from '../database/model';

export const authorizationUniversity = asyncHandler(
  async (req: ProtectedRequest, res, next) => {
    const { identityUniversity } = req.params;
    const { userName, roles } = req.user;

    if (roles.includes(Role.UNIVERSITY) && identityUniversity !== userName) {
      throw new AuthFailureError(`You cannot access this dac`);
    }
    return next();
  },
);

