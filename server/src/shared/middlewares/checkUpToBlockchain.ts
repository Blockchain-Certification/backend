import { Types } from 'mongoose';
import asyncHandler from '../../shared/helpers/asyncHandler';
import { ProtectedRequest } from 'app-request';
import checkUpBlockChainFactory from '../../common/decorator/checkUpBlockchain';


export const checkUpToBlockchain = (type : string) =>
  asyncHandler(async (req: ProtectedRequest, res, next) => {
    const checkUpBlockchain = checkUpBlockChainFactory.createTypeCheckUpBlockchain(type);
    await checkUpBlockchain?.check(new Types.ObjectId(req.params.id), req.user.userName);
    next();
  });