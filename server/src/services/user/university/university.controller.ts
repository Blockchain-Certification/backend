import { Response } from 'express';
import asyncHandler from '../../../shared/helpers/asyncHandler';
import { UniversityService } from './university.service';
import { SuccessResponse } from '../../../shared/core/apiResponse';
import { ProtectedRequest } from '../../../shared/types/app-request';
import { Types } from 'mongoose';
import { PaginationSearch, Pagination } from './interface';
import { caculateTotalPage } from '../../../shared/helpers/utils';

export class UniversityController {
  private univeristyService: UniversityService;
  constructor(univeristyService: UniversityService) {
    this.univeristyService = univeristyService;
  }

  public getList = asyncHandler(
    async (req: ProtectedRequest, res: Response) => {
      const pagination: Pagination = (({ page, limit }) => ({
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      }))(req.query);
      const data = await this.univeristyService.getList(pagination);

      return new SuccessResponse('Get list successfully', {
        success: true,
        data: data,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          totalPage : Math.ceil(await this.univeristyService.count()/pagination.limit )
        },
      }).send(res);
    },
  );

  public detail = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    const user = await this.univeristyService.detail(
      new Types.ObjectId(req.params.id),
    );
    return new SuccessResponse('Get detail successfully', {
      success: true,
      data: user,
    }).send(res);
  });

  public search = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    const paginationSearch: PaginationSearch = (({ page, limit, keyword }) => ({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      keyword: keyword + '',
    }))(req.query);
    const data = await this.univeristyService.search(paginationSearch);

    return new SuccessResponse('Search successfully', {
      success: true,
      data: data,
      pagination: {
        page: paginationSearch.page,
        limit: paginationSearch.limit,
        totalPage: caculateTotalPage(
          await this.univeristyService.count(),
          paginationSearch.limit,
        ),
      },
    }).send(res);
  });
}
