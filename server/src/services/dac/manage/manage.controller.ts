import {
  SuccessResponse,
} from '../../../shared/core/apiResponse';
import asyncHandler from '../../../shared/helpers/asyncHandler';
import DACManageService from './manage.service';
import { ProtectedRequest } from 'app-request';
import { Pagination } from './interface';
import { caculateTotalPage } from '../../../shared/helpers/utils';
import { Types } from 'mongoose';
import client from '../../../shared/cache';

export default class ManageDACController {
  private dacManageService: DACManageService;
  constructor(dacManageService: DACManageService) {
    this.dacManageService = dacManageService;
  }

  public issue = asyncHandler(async (req: ProtectedRequest, res, next) => {
    const { identityUniversity } = req.params;
    const listDACIssue = await this.dacManageService.issue(
      req.body,
      identityUniversity,
    );

    await client.del(`${req.baseUrl}/${identityUniversity}*`);
    return new SuccessResponse('Issue successfully', {
      success: true,
      data: listDACIssue,
    }).send(res);
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
     
      const value = JSON.stringify(data);
      await client.set(req.originalUrl, value, {
                    EX: 60,
                    NX: true,
                });

      return new SuccessResponse('Get List DAC successfully', {
        success: true,
        data: data.listDAC,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          totalPage: await caculateTotalPage(
            data.totalPage,
            pagination.limit,
          ),
        },
      }).send(res);
    },
  );

  public detail = asyncHandler(
    async (req: ProtectedRequest, res) => {
      const {idDAC} = req.params;
      const dac = await this.dacManageService.detail(new Types.ObjectId(idDAC));
      return new SuccessResponse('Detail successfully', {
        success: true,
        data: dac,
      }).send(res);
    },
  );
}
