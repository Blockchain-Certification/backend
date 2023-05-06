import { Types } from 'mongoose';

import DACGeneralService from './general.service';
import asyncHandler from '../../../shared/helpers/asyncHandler';
import { ProtectedRequest } from '../../../shared/types/app-request';
import { Pagination } from '../manage/interface';
import { SuccessMsgResponse, SuccessResponse } from '../../../shared/core/apiResponse';
import DACStudentService from '../student/student.service';
import { paramsToShareAddFieldNeedShareDefault } from '../utils';
export default class DACGeneralController {
  private dacGeneralService: DACGeneralService;
  private dacStudentService: DACStudentService;
  constructor(dacGeneralService: DACGeneralService, dacStudentService: DACStudentService) {
    this.dacGeneralService = dacGeneralService;
    this.dacStudentService =  DACStudentService;
  }

  public verify = asyncHandler(async (req: ProtectedRequest, res) => {
    await this.dacGeneralService.verify(req.body);
    return new SuccessMsgResponse("Verified successfully").send(res);
  });

  public generateProof = asyncHandler(async (req: ProtectedRequest, res) => {
    const {idDAC, identityStudent} = req.params;
    let {sharedField} = req.query;
    sharedField = typeof sharedField === 'string' ? sharedField : '';

    let sharedFields = sharedField.split(',');
    if (sharedFields[0] === '') {
      sharedFields = [];
    }
    sharedFields = await paramsToShareAddFieldNeedShareDefault(sharedFields);
    
    const data = await this.dacStudentService.generateProof( {
      sharedFields,
      idDAC: new Types.ObjectId(idDAC),
    },
    identityStudent);
    return new SuccessResponse('Create proof', {
      success: true,
      data,
    }).send(res);  });

}
