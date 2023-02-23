import { Request } from 'express';
import ApiKey from '../database/model/ApiKey';


declare interface PublicRequest extends Request {
  apiKey: ApiKey;
}

declare interface Tokens {
  accessToken: string;
  refreshToken: string;
}
