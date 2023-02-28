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
export default class RecipentProfileController {
  private recipentProfileService: RecipentProfileService;
  constructor(recipentProfile: RecipentProfileService) {
    this.recipentProfileService = recipentProfile;
  }

  public getList = asyncHandler(
    async (req: ProtectedRequest, res: Response) => {
      const { identity } = req.params;
      const { userName, roles } = req.user;

      if (roles.includes(Role.UNIVERSITY) && identity !== userName)
        throw new BadRequestError(
          'Not access data because user is not this param id',
        );

      const pagination = (({ page, limit }) => ({
        page: parseInt(page + ''),
        limit: parseInt(limit + ''),
      }))(req.query);

      const listDAC = await this.recipentProfileService.getList(
        pagination,
        identity,
      );
      return new SuccessResponse('Get list successfully', {
        success: true,
        data: listDAC,
      }).send(res);
    },
  );

  public updateDAC = asyncHandler(
    async (req: ProtectedRequest, res: Response) => {
      const { idDAC } = req.params;
      const id = new Types.ObjectId(idDAC);
      await this.recipentProfileService.update(id, req.body);
      const dac = await this.recipentProfileService.detail(id);
      return new SuccessResponse('Updated successfully', {
        success: true,
        data: dac,
      }).send(res);
    },
  );

  public create = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    await this.recipentProfileService.create(req.body);
    return new SuccessMsgResponse('Created successfully').send(res);
  });
}
