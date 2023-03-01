import asyncHandler from '../../../shared/helpers/asyncHandler';
import { InfoUserRepository } from '../../../shared/database/repository';
import { ProtectedRequest } from 'app-request';
import { Types } from 'mongoose';
import { AuthFailureError } from '../../../shared/core/apiError';
const infoUserRepository = new InfoUserRepository();
export const authorStudentOfUniversity = asyncHandler(
  async (req: ProtectedRequest, res, next) => {
    const student = await infoUserRepository.findById(
      new Types.ObjectId(req.params.id),
    );

    if (student && student?.createdBy?.toString() !== req.user._id.toString())
      throw new AuthFailureError(
        `You are not allowed to authorize this student`,
      );
    return next();
  },
);
