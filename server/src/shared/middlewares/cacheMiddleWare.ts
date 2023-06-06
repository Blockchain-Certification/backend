import { Response } from 'express';
import client from '../cache';
import asyncHandler from '../helpers/asyncHandler';
import { ProtectedRequest } from '../types/app-request';
import { SuccessResponse } from '../core/apiResponse';

export const cacheAside = asyncHandler(
  async (req: ProtectedRequest, res: Response, next) => {
    const key: string = req.originalUrl;
    
    const data: string | null = await client.get(key);
    if (data) {
      // Data exists in cache, send the response with the cached data
      return new SuccessResponse("Get data successfully",{
        success : true,
        data : JSON.parse(data)
      }).send(res);
    }

    // Data doesn't exist in cache, continue with the next middleware or handler
    return next();
  },
);
