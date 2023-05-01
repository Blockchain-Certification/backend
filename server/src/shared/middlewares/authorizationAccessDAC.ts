import { AuthFailureError, BadRequestError } from '../core/apiError';
import { DACRepository } from '../database/repository';
import asyncHandler from '../helpers/asyncHandler';
import { ProtectedRequest } from 'app-request';
import { Types } from 'mongoose';

const dacRepository = new DACRepository();
export const authorizationAccessDAC = asyncHandler(
  async (req: ProtectedRequest, res, next) => {
    const { idDAC } = req.params;
    const { userName } = req.user;

    const dac = await dacRepository.findById(new Types.ObjectId(idDAC));
    if(!dac) throw new BadRequestError('DAC not exist');

    if(dac.iSt !== userName)
    {
      throw new AuthFailureError('Authorization not access this dac');
    }
   
    return next();
  },
);

