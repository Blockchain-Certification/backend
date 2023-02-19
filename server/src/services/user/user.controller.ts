import { Request, Response } from 'express';
import asyncHandler from '../../shared/helpers/asyncHandler';
import { UserService } from './user.service';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public getList = asyncHandler(async (req: Request, res: Response) => {
    return res.status(200).send({
      message: await this.userService.getList(),
    });
  });
}
