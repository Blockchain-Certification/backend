import { DAC, Role } from '../../shared/database/model';
import asyncHandler from '../../shared/helpers/asyncHandler';
import { ProtectedRequest } from 'app-request';
import { AuthFailureError } from '../../shared/core/apiError';

export const hasDuplicateAndMustDuplicateIU = (students: DAC[]): boolean => {
  const iUs = new Set<string>();
  const infoSt = new Set<string>();

  let count = 0;
  for (const student of students) {
    const { iU, iSt, id } = student;
    if (infoSt.has(iSt) || iUs.has(iSt)  || infoSt.has(id)) {
      return true;
    }
    if (count > 0 && !iUs.has(iU)) return true;
    iUs.add(iU);
    infoSt.add(iSt);
    infoSt.add(id);
    count++;
  }
  return false;
};

export const authorizationRecipientProfile = asyncHandler(
  async (req: ProtectedRequest, res, next) => {
    const { identityUniversity } = req.params;
    const { userName, roles } = req.user;
    if (roles.includes(Role.UNIVERSITY) && userName !== identityUniversity)
      throw new AuthFailureError('Not allowed access data');
    return next();
  },
);
