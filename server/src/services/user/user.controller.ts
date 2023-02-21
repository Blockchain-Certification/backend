import { Request, Response } from 'express';
import asyncHandler from '../../shared/helpers/asyncHandler';
import { UserService } from './user.service';
import { User } from '../../shared/database/model';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public getList = asyncHandler(
    async (req: Request, res: Response): Promise<string> => {
      await this.userService.getList();
      res.send('hello');
      return '';
    },
  );
}
