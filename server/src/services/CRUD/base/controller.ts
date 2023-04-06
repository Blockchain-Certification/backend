import { Response } from 'express';
import { ProtectedRequest } from 'app-request';
import asyncHandler from '../../../shared/helpers/asyncHandler';
import service from './service';
import {
  SuccessMsgResponse,
  SuccessResponse,
} from '../../../shared/core/apiResponse';
import { Types } from 'mongoose';
service;
export default class Controller {
  private service : any;
  constructor(featureService: any) {
    this.service = featureService;
  }

  public getList = asyncHandler(
    async (req: ProtectedRequest, res: Response) => {
      const { page, limit } = req.query;

      const data = await this.service.getList(
        parseInt(page as string),
        parseInt(limit as string),
      );
      return new SuccessResponse('Get list successfully', {
        success: true,
        data: data,
        pagination: {
          page,
          limit,
          totalPage : Math.ceil(await this.service.count()/parseInt(limit as string) )
        },
      }).send(res);
    },
  );

  public create = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    const data = await this.service.create(req.body);
    return new SuccessResponse('Create successfully', {
      success: true,
      data: data,
    }).send(res);
  });

  public edit = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    const data = await this.service.edit(
      new Types.ObjectId(req.params.id),
      req.body,
    );
    return new SuccessResponse('Edit successfully', {
      success: true,
      data: data,
    }).send(res);
  });

  public delete = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    await this.service.delete(new Types.ObjectId(req.params.id));
    return new SuccessMsgResponse('Delete CertificateType successfully').send(
      res,
    );
  });

  public detail = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    const objectDetail = await this.service.detail(new Types.ObjectId(req.params.id));
    return new SuccessResponse('Get Detail Successfully', {
      success : true,
      data: objectDetail
    }).send(
      res,
    );
  });
}
