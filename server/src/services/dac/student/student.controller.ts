import DACStudentService from './student.service';
import asyncHandler from '../../../shared/helpers/asyncHandler';
import { ProtectedRequest } from '../../../shared/types/app-request';
import { Pagination } from '../manage/interface';
import { SuccessResponse } from '../../../shared/core/apiResponse';
import { identity } from 'lodash';
export default class DACStudentController {
  private dacStudentService: DACStudentService;
  constructor(dacStudentService: DACStudentService) {
    this.dacStudentService = dacStudentService;
  }

  public getListDACOfUniversity = asyncHandler(
    async (req: ProtectedRequest, res) => {
      const { userName } = req.user;

      const pagination: Pagination = (({ page, limit }) => ({
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      }))(req.query);

      const data = await this.dacStudentService.getListDACOfStudent(
        userName,
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
