import asyncHandler from '../../../shared/helpers/asyncHandler';
import { InfoUserRepository } from '../../../shared/database/repository';
import { ProtectedRequest } from 'app-request';
import { Types } from 'mongoose';
import { AuthFailureError } from '../../../shared/core/apiError';
import { Role } from '../../../shared/database/model';
const infoUserRepository = new InfoUserRepository();
export const authorStudentOfUniversity = asyncHandler(
  async (req: ProtectedRequest, res, next) => {
    const student = await infoUserRepository.findById(
      new Types.ObjectId(req.params.id),
    );
    const { _id, roles } = req.user;
    if (
      roles.includes(Role.UNIVERSITY) &&
      student &&
      student?.createdBy?.toString() !== _id.toString()
    )
      throw new AuthFailureError(
        `You are not allowed to authorize this student`,
      );
    return next();
  },
);
