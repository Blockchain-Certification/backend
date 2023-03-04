import {
  SuccessMsgResponse,
  SuccessResponse,
} from '../../../shared/core/apiResponse';
import asyncHandler from '../../../shared/helpers/asyncHandler';
import DACManageService from './manage.service';
import { ProtectedRequest } from 'app-request';
import { Pagination } from './interface';
export default class ManageDACController {
  private dacManageService: DACManageService;
  constructor(dacManageService: DACManageService) {
    this.dacManageService = dacManageService;
  }

  public issue = asyncHandler(async (req: ProtectedRequest, res, next) => {
    const { identityUniversity } = req.params;
    await this.dacManageService.issue(req.body, identityUniversity);
    return new SuccessMsgResponse('Issue successfully').send(res);
  });

  public getListDACOfUniversity = asyncHandler(
    async (req: ProtectedRequest, res) => {
      const { identityUniversity } = req.params;

      const pagination: Pagination = (({ page, limit }) => ({
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      }))(req.query);

      const data = await this.dacManageService.getListDACOfUniversity(
        identityUniversity,
        pagination,
      );

      return new SuccessResponse('Get List DAC successfully', {
        success: true,
        data,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
        },
      }).send(res);
    },
  );
}
