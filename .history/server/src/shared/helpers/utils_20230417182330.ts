import { BadRequestError, InternalError } from './../core/apiError';
import { Request } from 'express';
import moment from 'moment';
import Logger from '../core/logger';
import asyncHandler from './asyncHandler';
import { ProtectedRequest } from 'app-request';
import { Role } from '../database/model';
import { fieldDefault } from '../../common/constant';

export function findIpAddress(req: Request) {
  try {
    if (req.headers['x-forwarded-for']) {
      return req.headers['x-forwarded-for'].toString().split(',')[0];
    } else if (req.connection && req.connection.remoteAddress) {
      return req.connection.remoteAddress;
    }
    return req.ip;
  } catch (e) {
    Logger.error(e);
    return undefined;
  }
}

export function addMillisToCurrentDate(millis: number) {
  return moment().add(millis, 'ms').toDate();
}

export const role = (...role: Role[]) =>
  asyncHandler(async (req: ProtectedRequest, res, next) => {
    req.currentRoles = role;
    next();
  });

export const filterNull = async (list: any) => {
  return await list.filter((el: any) => el.idUser !== null);
};

export const caculateTotalPage = async (
  total: number,
  limit: number,
): Promise<number> => {
  return Math.ceil(total / limit);
};

export const paramsToShareAddFieldNeedShareDefault = async (
  paramsToShare: string[],
): Promise<string[]>  => {
  return await paramsToShare.concat(fieldDefault);
};
