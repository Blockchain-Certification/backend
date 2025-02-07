import AuthService from './auth.service';
import asyncHandler from '../../shared/helpers/asyncHandler';
import { Request, Response } from 'express';
import {
  SuccessResponse,
  TokenRefreshResponse,
  SuccessMsgResponse,
} from '../../shared/core/apiResponse';
import { ProtectedRequest } from '../../shared/types/app-request';
export default class AuthController {
  private authService: AuthService;
  constructor(authService: AuthService) {
    this.authService = authService;
  }
  public login = asyncHandler(async (req: Request, res: Response) => {
    const { userData, tokens } = await this.authService.login(req.body);
    // res.cookie('access_token', tokens.accessToken, {
    //   maxAge: tokenInfo.accessTokenValidity + 1000,
    //   httpOnly: true,
    // });
    // res.cookie('refresh_token', tokens.refreshToken, {
    //   maxAge: tokenInfo.refreshTokenValidity + 1000,
    //   httpOnly: true,
    // });

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

      // res.cookie('access_token', tokens.accessToken, {
      //   maxAge: tokenInfo.accessTokenValidity + 1000,
      //   httpOnly: true,
      // });
      // res.cookie('refresh_token', tokens.refreshToken, {
      //   maxAge: tokenInfo.refreshTokenValidity + 1000,
      //   httpOnly: true,
      // });

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

  public register = asyncHandler(
    async (req: ProtectedRequest, res: Response) => {
      const { _id } = req.user;
      const listNewUser = await this.authService.register(req.body, _id);
      return new SuccessResponse('Created Successfully', {
        success: true,
        data: listNewUser,
      }).send(res);
    },
  );
}
