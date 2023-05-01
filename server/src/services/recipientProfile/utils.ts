import { DAC, Role } from '../../shared/database/model';
import asyncHandler from '../../shared/helpers/asyncHandler';
import { ProtectedRequest } from 'app-request';
import { AuthFailureError } from '../../shared/core/apiError';
import { FlagFilter } from './interface';

export const hasDuplicateAndMustDuplicateIU = (students: DAC[]): boolean => {
  const iUs = new Set<string>();
  const infoSt = new Set<string>();

  let count = 0;
  for (const student of students) {
    const { iU, iSt, id } = student;
    if (infoSt.has(iSt) || iUs.has(iSt)  || infoSt.has(id)) {
      return true;
    }
    if (count > 0 && !iUs.has(iU)) return true;
    iUs.add(iU);
    infoSt.add(iSt);
    infoSt.add(id);
    count++;
  }
  return false;
};


export const filterConditionRecipientProfileAndIdNumber = async (flag: FlagFilter, listRecipientProfile: DAC[]) => {
  const filteredList = listRecipientProfile.filter(el =>
    (flag.registrationNumber ? el.registrationNum !== null : el.registrationNum === null) &&
    (flag.idNumber ? el.idNumber !== null : el.idNumber === null)
  );
  
  return filteredList;
}
