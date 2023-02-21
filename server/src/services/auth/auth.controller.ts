import AuthService from './auth.service';
import asyncHandler from '../../shared/helpers/asyncHandler';
import { Request, Response } from 'express';
import {  SuccessResponse } from '../../shared/core/apiResponse';
export default class AuthController {
  private authService: AuthService;
  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public register = asyncHandler(async (req: Request, res: Response) => {
      const user = await this.authService.register(req.body);
      return new SuccessResponse('Created successfully',{'data' : 'data'}).send(res);
  });
}
