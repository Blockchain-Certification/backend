import DACGeneralService from './general.service';
import asyncHandler from '../../../shared/helpers/asyncHandler';
import { ProtectedRequest } from '../../../shared/types/app-request';
import { Pagination } from '../manage/interface';
import { SuccessResponse } from '../../../shared/core/apiResponse';
import { Types } from 'mongoose';
export default class DACGeneralController {
  private dacGeneralService: DACGeneralService;
  constructor(dacGeneralService: DACGeneralService) {
    this.dacGeneralService = dacGeneralService;
  }

  public verify = asyncHandler(
    async (req: ProtectedRequest, res) => {
      // const data = await this.dacGeneralService.verify(req.body);
      return new SuccessResponse('Get List DAC successfully', {
        success: true,
      }).send(res);
    },
  );

 
}
