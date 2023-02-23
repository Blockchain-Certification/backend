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
    return new SuccessResponse('Created successfully', {
      success: true,
    }).send(res);
  });

  public login = asyncHandler(async (req: Request, res: Response) => {
    const { userData, tokens } = await this.authService.login(req.body);
    res.cookie('access_token', tokens.accessToken, {
      maxAge: 7200000,
      httpOnly: true,
      secure: true,
    });
    return new SuccessResponse('Login successfully', {
      success: true,
      userData,
      tokens,
    }).send(res);
  });
}
