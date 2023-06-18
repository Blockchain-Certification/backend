import { BadRequestError, InternalError } from './../core/apiError';
import { Request } from 'express';
import moment from 'moment';
import Logger from '../core/logger';
import asyncHandler from './asyncHandler';
import { ProtectedRequest } from 'app-request';
import { Role } from '../database/model';
import { fieldDefault } from '../../common/constant';
import { Pagination } from '../../services/recipientProfile/interface';

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

export const filterNonNullWithPagination = async (list: any[], pagination: Pagination) => {
    const filteredList = await list.filter((el: any) => el.idUser !== null);
    
    const { page, limit } = pagination;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedList = filteredList.slice(startIndex, endIndex);
    
    return paginatedList;
};
  
export const filterNull = async (list: any[]) => {
  
  
  return list;
};

export const caculateTotalPage = async (
  total: number,
  limit: number,
): Promise<number> => {
  return  Math.ceil(total / limit);
};

export const paramsToShareAddFieldNeedShareDefault = async (
  paramsToShare: string[],
): Promise<string[]> => {
  return paramsToShare.concat(fieldDefault);
};



export const paginationManual = async (listDAC: any[], pagination : Pagination) => {
  const { page, limit } = pagination;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + page;

  return listDAC.slice(startIndex, endIndex);
}