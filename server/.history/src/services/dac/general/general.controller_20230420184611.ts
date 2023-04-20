import DACGeneralService from './general.service';
import asyncHandler from '../../../shared/helpers/asyncHandler';
import { ProtectedRequest } from '../../../shared/types/app-request';
import { Pagination } from '../manage/interface';
import { SuccessMsgResponse, SuccessResponse } from '../../../shared/core/apiResponse';
export default class DACGeneralController {
  private dacGeneralService: DACGeneralService;
  constructor(dacGeneralService: DACGeneralService) {
    this.dacGeneralService = dacGeneralService;
  }

  public verify = asyncHandler(async (req: ProtectedRequest, res) => {
    await this.dacGeneralService.verify(req.body);
    return new SuccessMsgResponse("Verified successfully")
  });
}
