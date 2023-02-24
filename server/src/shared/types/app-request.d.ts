import { Request } from 'express';
import ApiKey from '../database/model/ApiKey';
import { Role, User } from '../database/model';
import Keystore from '../database/model/KeyStore';

declare interface PublicRequest extends Request {
  apiKey: ApiKey;
}

declare interface Tokens {
  accessToken: string;
  refreshToken: string;
}

declare interface RoleRequest extends PublicRequest{
  currentRole : Role[];
}

declare interface ProtectedRequest extends RoleRequest{
  user : User;
  keyStore: Keystore;
}