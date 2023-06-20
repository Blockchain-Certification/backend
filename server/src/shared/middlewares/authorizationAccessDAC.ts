import { ADMIN_ID } from '../../common/constant';
import { AuthFailureError, BadRequestError } from '../core/apiError';
import { DACRepository } from '../database/repository';
import { queryCertificateByUUID } from '../fabric/callFuncChainCode';
import asyncHandler from '../helpers/asyncHandler';
import { ProtectedRequest } from 'app-request';
import { Types } from 'mongoose';

export const authorizationAccessDAC = asyncHandler(
  async (req: ProtectedRequest, res, next) => {
    const { idDAC } = req.params;
    const { userName } = req.user;
    let certBlockchain;
    try{
       certBlockchain = await queryCertificateByUUID(idDAC, ADMIN_ID);
    
    }
    catch(err){
      throw new BadRequestError('DAC not exist');
    }
    const dac = JSON.parse(certBlockchain.properties);
    if(dac.iSt !== userName)
    {
      throw new AuthFailureError('Authorization not access this dac');
    }
   
    return next();
  },
);

