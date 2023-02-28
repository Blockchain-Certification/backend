import { BadRequestError, InternalError } from './../core/apiError';
import { Request } from 'express';
import moment from 'moment';
import Logger from '../core/logger';
import asyncHandler from './asyncHandler';
import { ProtectedRequest } from 'app-request';
import { Role } from '../database/model';
import { DACRepository } from '../database/repository';
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

export const checkUpBlockchain = async (
  name: string,
  numberFunction: number,
): Promise<void> => {
  const dacRepository = new DACRepository();
  const existedDAC = await selectFunction();

  if (existedDAC && existedDAC.length > 0)
    throw new BadRequestError('Data that is on the DAC cannot be change');

  function selectFunction() {
    switch (numberFunction) {
      case 1:
        return dacRepository.findByTypeCert(name);
      case 2:
        return dacRepository.findByCourse(name);
      default:
        throw new InternalError('Error: Invalid number function');
    }
  }
};

export const isValidName = async (
  name: string,
  list: any,
): Promise<boolean> => {
  name = clearCharacter(name);

  const check = await list.filter((el: any) => {
    let nameEl = el.name || el.year;
    nameEl = clearCharacter(nameEl);
    return nameEl === name;
  });
  if (check.length > 0) return true;

  return false;

  function clearCharacter(name: string) {
    if (typeof +name === 'number') return name;
    return name.toLowerCase().replace(/\s+/g, '');
  }
};

export const filterNull = async (list: any) => {
  return await list.filter((el: any) => el.idUser !== null);
};
