import { Response } from 'express';
import { ProtectedRequest } from 'app-request';
import asyncHandler from '../../shared/helpers/asyncHandler';
import CertificateTypeService from './certifcatesType.service';
import {
  SuccessMsgResponse,
  SuccessResponse,
} from '../../shared/core/apiResponse';
import { Types } from 'mongoose';
CertificateTypeService;
export default class CertificateTypeController {
  private certificateTypeService: CertificateTypeService;

  constructor(certificateTypeService: CertificateTypeService) {
    this.certificateTypeService = certificateTypeService;
  }

  public getList = asyncHandler(
    async (req: ProtectedRequest, res: Response) => {
      const { page, limit } = req.query;

      const data = await this.certificateTypeService.getList(
        parseInt(page as string),
        parseInt(limit as string),
      );
      return new SuccessResponse('Get list successfully', {
        success: true,
        certTypes: data,
      }).send(res);
    },
  );

  public create = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    const newCertType = await this.certificateTypeService.create(req.body);
    return new SuccessResponse('Create successfully', {
      success: true,
      certType: newCertType,
    }).send(res);
  });

  public edit = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    const editCert = await this.certificateTypeService.edit(
      new Types.ObjectId(req.params.id),
      req.body,
    );
    return new SuccessResponse('Create successfully', {
      success: true,
      certType: editCert,
    }).send(res);
  });

  public delete = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    await this.certificateTypeService.delete(new Types.ObjectId(req.params.id));
    return new SuccessMsgResponse('Delete CertificateType successfully').send(
      res,
    );
  });
}
