import { Request, Response } from 'express';
import asyncHandler from '../../shared/helpers/asyncHandler';
import { UserService, argsGetList } from './user.service';
import {
  SuccessMsgResponse,
  SuccessResponse,
} from '../../shared/core/apiResponse';
import { ProtectedRequest } from '../../shared/types/app-request';
import { Types } from 'mongoose';
export class UserController {
  private userService: UserService;
  constructor(userService: UserService) {
    this.userService = userService;
  }

  public getList = asyncHandler(
    async (req: ProtectedRequest, res: Response) => {
      const args: argsGetList = (({ page, limit, filter }) => ({
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        filter: filter as string | undefined,
      }))(req.query);

      const data = await this.userService.getList(args);

      return new SuccessResponse('Get list successfully', {
        success: true,
        data: data,
        pagination: {
          page: args.page,
          limit: args.limit,
        },
      }).send(res);
    },
  );

  public edit = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    const data = await this.userService.edit(
      new Types.ObjectId(req.params.id),
      req.body,
    );
    return new SuccessResponse('Edit successfully', {
      success: true,
      data: data,
    }).send(res);
  });

  public delete = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    await this.userService.delete(new Types.ObjectId(req.params.id));
    return new SuccessMsgResponse('Delete User successfully').send(res);
  });

  public detail = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    const user = await this.userService.detail(
      new Types.ObjectId(req.params.id),
    );
    return new SuccessResponse('Get detail successfully', {
      success: true,
      data: user,
    }).send(res);
  });
}
