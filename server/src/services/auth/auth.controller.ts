import AuthService from './auth.service';
import asyncHandler from '../../shared/helpers/asyncHandler';
import { Request, Response } from 'express';
import { SuccessResponse } from '../../shared/core/apiResponse';
export default class AuthController {
  private authService: AuthService;
  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public register = asyncHandler(async (req: Request, res: Response) => {
    await this.authService.register(req.body);
    await new SuccessResponse('Created successfully', {
      success: true,
    }).send(res);
  });
}
