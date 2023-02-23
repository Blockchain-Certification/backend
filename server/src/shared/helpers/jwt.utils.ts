import { User } from '../database/model';
import { Tokens } from '../types/app-request';
import JWT, { JwtPayload } from '../core/JWT';
import { tokenInfo } from '../../config';
import { InternalError } from '../core/apiError';
const  createTokens = async (
    user: User,
    accessTokenKey: string,
    refreshTokenKey: string,
  ): Promise<Tokens> => {
    const accessToken = await JWT.encode(
      new JwtPayload(
        tokenInfo.issuer,
        tokenInfo.audience,
        user._id.toString(),
        accessTokenKey,
        tokenInfo.accessTokenValidity,
      ),
    );
    if (!accessToken) throw new InternalError();
    const refreshToken = await JWT.encode(
      new JwtPayload(
        tokenInfo.issuer,
        tokenInfo.audience,
        user._id.toString(),
        refreshTokenKey,
        tokenInfo.refreshTokenValidity,
      ),
    );

    if (!refreshToken) throw new InternalError();

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    } as Tokens;
  }

export {
  createTokens,
}
