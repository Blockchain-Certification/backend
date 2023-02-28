import AuthService from './auth.service';
import asyncHandler from '../../shared/helpers/asyncHandler';
import { Request, Response } from 'express';
import {
  SuccessResponse,
  TokenRefreshResponse,
  SuccessMsgResponse,
} from '../../shared/core/apiResponse';
import { ProtectedRequest } from '../../shared/types/app-request';
import { tokenInfo } from '../../config';
export default class AuthController {
  private authService: AuthService;
  constructor(authService: AuthService) {
    this.authService = authService;
  }
  public login = asyncHandler(async (req: Request, res: Response) => {
    const { userData, tokens } = await this.authService.login(req.body);
    res
      .cookie('access_token', tokens.accessToken, {
        maxAge: tokenInfo.accessTokenValidity + 1000,
        httpOnly: true,
        sameSite: 'strict',
      })
      .cookie('refresh_token', tokens.refreshToken, {
        maxAge: tokenInfo.refreshTokenValidity + 1000,
        httpOnly: true,
        sameSite: 'strict',
      });

    return new SuccessResponse('Login successfully', {
      success: true,
      userData,
      tokens,
    }).send(res);
  });

  public refreshToken = asyncHandler(
    async (req: ProtectedRequest, res: Response) => {
      const token = {
        accessToken: req.cookies.access_token,
        refreshToken: req.cookies.refresh_token,
      };
      const tokens = await this.authService.refreshToken(token);

      res.cookie('access_token', tokens.accessToken, {
        maxAge: tokenInfo.accessTokenValidity + 1000,
        httpOnly: true,
        sameSite: 'strict',
      });
      res.cookie('refresh_token', tokens.refreshToken, {
        maxAge: tokenInfo.refreshTokenValidity + 1000,
        httpOnly: true,
        sameSite: 'strict',
      });

      return new TokenRefreshResponse(
        'Token Issued',
        tokens.accessToken,
        tokens.refreshToken,
      ).send(res);
    },
  );

  public logout = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    await this.authService.logout(req.keyStore._id);
    new SuccessMsgResponse('Logout success').send(res);
  });

  public register = asyncHandler(async (req: Request, res: Response) => {
    await this.authService.register(req.body);
    return new SuccessMsgResponse('Created Successfully').send(res);
  });
}
