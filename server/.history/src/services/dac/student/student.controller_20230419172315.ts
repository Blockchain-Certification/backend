import DACStudentService from './student.service';
import asyncHandler from '../../../shared/helpers/asyncHandler';
import { ProtectedRequest } from '../../../shared/types/app-request';
import { Pagination } from '../manage/interface';
import { SuccessResponse } from '../../../shared/core/apiResponse';
import { Types } from 'mongoose';

import {
  caculateTotalPage,
  paramsToShareAddFieldNeedShareDefault,
} from '../../../shared/helpers/utils';

>>>>>>> master
export default class DACStudentController {
  private dacStudentService: DACStudentService;
  constructor(dacStudentService: DACStudentService) {
    this.dacStudentService = dacStudentService;
  }

  public getListDACOfStudent = asyncHandler(
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
          total: caculateTotalPage(
            await this.dacStudentService.count(),
            pagination.limit,
          ),
        },
      }).send(res);
    },
  );

  public generateProof = asyncHandler(async (req: ProtectedRequest, res) => {
    let { sharedField } = req.query;
    const { idDAC } = req.params;
    const { userName } = req.user;
    sharedField = typeof sharedField === 'string' ? sharedField : '';


    let sharedFields = sharedField.split(',');
    if (sharedFields[0] === '') {
      sharedFields = [];
    }
    sharedFields = await paramsToShareAddFieldNeedShareDefault(sharedFields);
    const data = await this.dacStudentService.generateProof(
      {
        sharedFields,
        idDAC: new Types.ObjectId(idDAC),
      },
      userName,
    );

    return new SuccessResponse('Create proof', {
      success: true,
      data,
    }).send(res);
  });
}
