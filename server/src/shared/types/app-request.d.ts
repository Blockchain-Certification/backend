import { Request } from 'express';

import ApiKey from '../database/model/apiKey';

declare interface PublicRequest extends Request {
  apiKey: ApiKey;
}
