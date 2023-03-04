import { SuccessMsgResponse } from '../../../shared/core/apiResponse';
import asyncHandler from '../../../shared/helpers/asyncHandler';
import DACService from './manage.service';
import { ProtectedRequest } from 'app-request';

export default class ManageDACController {
  private dacService: DACService;
  constructor(dacService: DACService) {
    this.dacService = dacService;
  }

  public issue = asyncHandler(async (req: ProtectedRequest, res, next) => {
    const { identityUniversity } = req.params;
    await this.dacService.issue(req.body, identityUniversity);
    return new SuccessMsgResponse('Issue successfully').send(res);
  });
}
