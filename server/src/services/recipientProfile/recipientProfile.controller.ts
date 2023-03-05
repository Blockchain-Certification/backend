import { Response } from 'express';
import {
  SuccessMsgResponse,
  SuccessResponse,
} from '../../shared/core/apiResponse';
import asyncHandler from '../../shared/helpers/asyncHandler';
import RecipentProfileService from './recipientProfile.service';
import { ProtectedRequest } from 'app-request';
import { BadRequestError } from '../../shared/core/apiError';
import { Types } from 'mongoose';
import { Role } from '../../shared/database/model';
import { Pagination, PaginationGetList } from './interface';
export default class RecipentProfileController {
  private recipentProfileService: RecipentProfileService;

  constructor(recipentProfile: RecipentProfileService) {
    this.recipentProfileService = recipentProfile;
  }

  public getList = asyncHandler(
    async (req: ProtectedRequest, res: Response) => {
      const { identityUniversity } = req.params;
      const { userName, roles } = req.user;

      if (!roles.includes(Role.UNIVERSITY) || identityUniversity !== userName)
        throw new BadRequestError(
          'Not access data because user not belong to param identityUniversity ',
        );

      const pagination = (({ page, limit, dispensingStatus }) => ({
        page: parseInt(page + ''),
        limit: parseInt(limit + ''),
        dispensingStatus: dispensingStatus ? dispensingStatus : false,
      }))(req.query);

      const listDAC = await this.recipentProfileService.getList(
        pagination as PaginationGetList,
        identityUniversity,
      );
      return new SuccessResponse('Get list successfully', {
        success: true,
        data: listDAC,
      }).send(res);
    },
  );

  public regisIdNumber = asyncHandler(
    async (req: ProtectedRequest, res: Response) => {
      const { identityUniversity } = req.params;
      const data = await this.recipentProfileService.regisIdNumber(
        req.body,
        identityUniversity,
      );
      return new SuccessResponse('Update successfully', {
        success: true,
        data,
      }).send(res);
    },
  );

  public registrationNumber = asyncHandler(
    async (req: ProtectedRequest, res: Response) => {
      const { identityUniversity } = req.params;
      const data = await this.recipentProfileService.registrationNum(
        req.body,
        identityUniversity,
      );
      return new SuccessResponse('Updated successfully', {
        success: true,
        data,
      }).send(res);
    },
  );
  public updateInfoDAC = asyncHandler(
    async (req: ProtectedRequest, res: Response) => {
      const { idDAC, identityUniversity } = req.params;
      const id = new Types.ObjectId(idDAC);
      const dac = await this.recipentProfileService.detail(id);

      if (dac?.iU !== identityUniversity)
        throw new BadRequestError(
          `Invalid param identityUniversity ${identityUniversity}: must`,
        );

      await this.recipentProfileService.updateInfo(id, req.body);
      return new SuccessResponse('Updated successfully', {
        success: true,
        data: dac,
      }).send(res);
    },
  );

  public delete = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    const { idDAC,identityUniversity } = req.params;
    await this.recipentProfileService.delete(new Types.ObjectId(idDAC),identityUniversity);
    return new SuccessMsgResponse('Deleted successfully').send(res);
  });

  public detail = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    const { idDAC } = req.params;
    const dac = await this.recipentProfileService.detail(
      new Types.ObjectId(idDAC),
    );
    return new SuccessResponse('Get detail successfully', {
      success: true,
      data: dac,
    }).send(res);
  });

  public create = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    const { identityUniversity } = req.params;
    await this.recipentProfileService.create(req.body, identityUniversity);
    return new SuccessMsgResponse('Created successfully').send(res);
  });
}
